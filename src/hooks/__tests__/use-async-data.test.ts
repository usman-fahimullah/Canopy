import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useAsyncData } from "../use-async-data";

describe("useAsyncData", () => {
  it("starts in loading state", () => {
    const fetcher = vi.fn(() => new Promise<string>(() => {})); // never resolves
    const { result } = renderHook(() => useAsyncData(fetcher));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.status).toBe("loading");
  });

  it("transitions to success state when fetcher resolves", async () => {
    const fetcher = vi.fn().mockResolvedValue({ items: [1, 2, 3] });
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.data).toEqual({ items: [1, 2, 3] });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
  });

  it("transitions to error state when fetcher rejects", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Network failure"));
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toBe("Network failure");
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("handles non-Error rejection", async () => {
    const fetcher = vi.fn().mockRejectedValue("string error");
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toBe("An unexpected error occurred");
  });

  it("skips fetching when enabled is false", async () => {
    const fetcher = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() => useAsyncData(fetcher, [], { enabled: false }));

    // Wait a tick to ensure no fetch happens
    await new Promise((r) => setTimeout(r, 50));

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.status).toBe("loading");
    expect(result.current.data).toBeNull();
  });

  it("refetches when calling refetch", async () => {
    let callCount = 0;
    const fetcher = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve(`result-${callCount}`);
    });

    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });
    expect(result.current.data).toBe("result-1");

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toBe("result-2");
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("re-fetches when dependencies change", async () => {
    const fetcher = vi.fn().mockResolvedValue("data");
    let dep = "a";

    const { result, rerender } = renderHook(() => useAsyncData(fetcher, [dep]));

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });
    expect(fetcher).toHaveBeenCalledTimes(1);

    dep = "b";
    rerender();

    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });

  it("provides a refetch function", async () => {
    const fetcher = vi.fn().mockResolvedValue("data");
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  it("keeps previous data during refetch when keepPreviousData is true", async () => {
    let callCount = 0;
    const fetcher = vi.fn().mockImplementation(() => {
      callCount++;
      return new Promise((resolve) => setTimeout(() => resolve(`result-${callCount}`), 50));
    });

    const { result } = renderHook(() => useAsyncData(fetcher, [], { keepPreviousData: true }));

    await waitFor(() => {
      expect(result.current.data).toBe("result-1");
    });

    // Trigger refetch
    act(() => {
      result.current.refetch();
    });

    // During refetch, previous data should still be available
    expect(result.current.data).toBe("result-1");
    expect(result.current.isFetching).toBe(true);

    // Wait for new data
    await waitFor(() => {
      expect(result.current.data).toBe("result-2");
    });
  });
});
