/**
 * CSV generation utility.
 * Pure functions — no dependencies on server/client environment.
 */

/**
 * Escape a cell value for CSV format.
 * Wraps in quotes if the value contains commas, quotes, or newlines.
 */
function escapeCSVCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Generate a CSV string from headers and rows.
 */
export function generateCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escapeCSVCell).join(",");
  const dataLines = rows.map((row) => row.map(escapeCSVCell).join(","));
  return [headerLine, ...dataLines].join("\n");
}

/**
 * Trigger a CSV file download in the browser.
 * Client-side only.
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
