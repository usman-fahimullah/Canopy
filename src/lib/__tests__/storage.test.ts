import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUpload = vi.fn();
const mockRemove = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        remove: mockRemove,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  }),
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() },
  formatError: vi.fn((e) => String(e)),
}));

import { BUCKETS, uploadFile, uploadProfilePhoto, uploadMessageAttachment, uploadResume, deleteFile } from "../storage";

describe("BUCKETS", () => {
  it("exports expected bucket names", () => {
    expect(BUCKETS.avatars).toBe("avatars");
    expect(BUCKETS.messageAttachments).toBe("message-attachments");
    expect(BUCKETS.resumes).toBe("resumes");
  });
});

describe("uploadFile", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns public URL on success", async () => {
    mockUpload.mockResolvedValue({ data: { path: "test/file.jpg" }, error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: "https://cdn.example.com/test/file.jpg" } });
    const result = await uploadFile(new File(["data"], "file.jpg") as any, "avatars", "test/file.jpg");
    expect(result.url).toBe("https://cdn.example.com/test/file.jpg");
    expect(result.error).toBeUndefined();
  });

  it("returns error on upload failure", async () => {
    mockUpload.mockResolvedValue({ data: null, error: { message: "Upload failed" } });
    const result = await uploadFile(new File(["data"], "file.jpg") as any, "avatars", "test/file.jpg");
    expect(result.url).toBe("");
    expect(result.error).toBe("Upload failed");
  });
});

describe("uploadProfilePhoto", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("constructs correct path from accountId", async () => {
    mockUpload.mockResolvedValue({ data: { path: "acc1/avatar.jpg" }, error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: "https://cdn.example.com/acc1/avatar.jpg" } });
    const result = await uploadProfilePhoto(new File(["data"], "photo.jpg") as any, "acc1");
    expect(result.url).toContain("acc1");
  });
});

describe("uploadMessageAttachment", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("sanitizes filename", async () => {
    mockUpload.mockResolvedValue({ data: { path: "c1/123-file_name.pdf" }, error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: "https://cdn.example.com/c1/123-file_name.pdf" } });
    const result = await uploadMessageAttachment(new File(["data"], "file name!.pdf") as any, "c1");
    expect(result.url).toBeTruthy();
  });
});

describe("deleteFile", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns success on delete", async () => {
    mockRemove.mockResolvedValue({ error: null });
    const result = await deleteFile("avatars", "acc1/avatar.jpg");
    expect(result.success).toBe(true);
  });

  it("returns error on delete failure", async () => {
    mockRemove.mockResolvedValue({ error: { message: "Not found" } });
    const result = await deleteFile("avatars", "acc1/avatar.jpg");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Not found");
  });
});
