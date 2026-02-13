/**
 * CSV import and parsing utilities for role/job bulk import.
 * Pure functions — no dependencies on server/client environment.
 * RFC 4180 compliant: quoted fields, embedded commas, escaped quotes, newlines.
 */

export interface ParsedRole {
  title: string;
  description?: string;
  location?: string;
  locationType?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  closesAt?: string;
}

export interface ParsedRow {
  rowIndex: number;
  data: ParsedRole;
  errors: { field: string; message: string }[];
}

const VALID_LOCATION_TYPES = new Set(["ONSITE", "REMOTE", "HYBRID"]);
const VALID_EMPLOYMENT_TYPES = new Set([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "VOLUNTEER",
]);

/** Maps user-friendly (lowercased) header labels to schema field names. */
export const HEADER_ALIASES: Record<string, string> = {
  title: "title",
  "job title": "title",
  role: "title",
  "role title": "title",
  description: "description",
  "job description": "description",
  location: "location",
  city: "location",
  "location type": "locationType",
  "work type": "locationType",
  remote: "locationType",
  "employment type": "employmentType",
  "job type": "employmentType",
  type: "employmentType",
  "salary min": "salaryMin",
  "minimum salary": "salaryMin",
  "min salary": "salaryMin",
  "salary max": "salaryMax",
  "maximum salary": "salaryMax",
  "max salary": "salaryMax",
  "closing date": "closesAt",
  "close date": "closesAt",
  deadline: "closesAt",
};

/** Sample CSV content users can download as a template. */
export const SAMPLE_CSV = `Title,Description,Location,Location Type,Employment Type,Salary Min,Salary Max,Closing Date
"Solar Installation Lead","Install and maintain solar panel systems","San Francisco, CA",ONSITE,FULL_TIME,75000,95000,2026-06-01
"Sustainability Coordinator","Coordinate ESG reporting and sustainability programs",Remote,REMOTE,FULL_TIME,65000,85000,2026-07-15`;

/**
 * Parse a raw CSV string into headers and rows.
 * Handles quoted fields, escaped double-quotes (``""``), embedded commas/newlines,
 * UTF-8 BOM removal, whitespace trimming, and empty-row skipping.
 */
export function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const cleaned = text.startsWith("\uFEFF") ? text.slice(1) : text;
  const allRows: string[][] = [];
  let currentRow: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  while (i < cleaned.length) {
    const ch = cleaned[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < cleaned.length && cleaned[i + 1] === '"') {
          cell += '"'; // escaped double-quote
          i += 2;
        } else {
          inQuotes = false; // end of quoted field
          i++;
        }
      } else {
        cell += ch;
        i++;
      }
    } else if (ch === '"') {
      inQuotes = true;
      i++;
    } else if (ch === ",") {
      currentRow.push(cell.trim());
      cell = "";
      i++;
    } else if (ch === "\r" || ch === "\n") {
      currentRow.push(cell.trim());
      cell = "";
      allRows.push(currentRow);
      currentRow = [];
      // consume \r\n as a single line break
      i += ch === "\r" && cleaned[i + 1] === "\n" ? 2 : 1;
    } else {
      cell += ch;
      i++;
    }
  }

  // Flush remaining cell/row
  if (cell.length > 0 || currentRow.length > 0) {
    currentRow.push(cell.trim());
    allRows.push(currentRow);
  }

  const nonEmpty = allRows.filter((row) => row.some((c) => c !== ""));
  if (nonEmpty.length === 0) return { headers: [], rows: [] };
  return { headers: nonEmpty[0], rows: nonEmpty.slice(1) };
}

/**
 * Normalize raw CSV headers to schema field names via HEADER_ALIASES.
 * Returns `mapped` (field name to column index) and `unknown` (unrecognized headers).
 */
export function normalizeHeaders(headers: string[]): {
  mapped: Record<string, number>;
  unknown: string[];
} {
  const mapped: Record<string, number> = {};
  const unknown: string[] = [];

  headers.forEach((raw, index) => {
    const field = HEADER_ALIASES[raw.toLowerCase().trim()];
    if (field && !(field in mapped)) {
      mapped[field] = index; // first match wins
    } else if (!field) {
      unknown.push(raw);
    }
  });

  return { mapped, unknown };
}

/** Safely extract a trimmed cell value; returns undefined for missing/empty. */
function cellAt(row: string[], index: number | undefined): string | undefined {
  if (index === undefined) return undefined;
  const v = row[index]?.trim();
  return v === "" ? undefined : v;
}

/** Parse a numeric string (strips $ and commas); returns undefined if not finite. */
function parseOptionalNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const n = Number(value.replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** Validate an enum field (case/separator insensitive). */
function validateEnum(
  raw: string | undefined,
  valid: Set<string>,
  field: string,
  label: string,
  errors: { field: string; message: string }[]
): string | undefined {
  if (!raw) return undefined;
  const upper = raw.toUpperCase().replace(/[\s-]/g, "_");
  if (valid.has(upper)) return upper;
  errors.push({
    field,
    message: `Invalid ${label} "${raw}". Must be ${Array.from(valid).join(", ")}`,
  });
  return undefined;
}

/** Validate and normalize a single data row. */
function validateRow(row: string[], rowIndex: number, mapped: Record<string, number>): ParsedRow {
  const errors: { field: string; message: string }[] = [];
  const title = cellAt(row, mapped.title) ?? "";
  const description = cellAt(row, mapped.description);
  const location = cellAt(row, mapped.location);
  const rawSalaryMin = cellAt(row, mapped.salaryMin);
  const rawSalaryMax = cellAt(row, mapped.salaryMax);
  const rawClosesAt = cellAt(row, mapped.closesAt);

  if (!title) errors.push({ field: "title", message: "Title is required" });

  const locationType = validateEnum(
    cellAt(row, mapped.locationType),
    VALID_LOCATION_TYPES,
    "locationType",
    "location type",
    errors
  );
  const employmentType = validateEnum(
    cellAt(row, mapped.employmentType),
    VALID_EMPLOYMENT_TYPES,
    "employmentType",
    "employment type",
    errors
  );

  let salaryMin: number | undefined;
  if (rawSalaryMin !== undefined) {
    salaryMin = parseOptionalNumber(rawSalaryMin);
    if (salaryMin === undefined)
      errors.push({ field: "salaryMin", message: `"${rawSalaryMin}" is not a valid number` });
  }

  let salaryMax: number | undefined;
  if (rawSalaryMax !== undefined) {
    salaryMax = parseOptionalNumber(rawSalaryMax);
    if (salaryMax === undefined)
      errors.push({ field: "salaryMax", message: `"${rawSalaryMax}" is not a valid number` });
  }

  let closesAt: string | undefined;
  if (rawClosesAt) {
    const d = new Date(rawClosesAt);
    if (Number.isNaN(d.getTime()))
      errors.push({ field: "closesAt", message: `"${rawClosesAt}" is not a valid date` });
    else closesAt = d.toISOString();
  }

  return {
    rowIndex,
    data: {
      title,
      description,
      location,
      locationType,
      employmentType,
      salaryMin,
      salaryMax,
      closesAt,
    },
    errors,
  };
}

/**
 * End-to-end: parse CSV text into validated role rows ready for import.
 * Combines parsing, header normalization, field extraction, and per-row validation.
 */
export function parseRolesFromCSV(text: string): {
  rows: ParsedRow[];
  unmappedHeaders: string[];
} {
  const { headers, rows } = parseCSV(text);
  const { mapped, unknown } = normalizeHeaders(headers);
  const parsedRows = rows.map((row, i) => validateRow(row, i + 1, mapped));
  return { rows: parsedRows, unmappedHeaders: unknown };
}
