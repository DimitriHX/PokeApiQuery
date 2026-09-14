import { describe, expect, it } from "vitest";
import { createQueryClient, oneDay } from "@/lib/query-client";

describe("QueryClient Configuration", () => {
  it("debe configurar staleTime a 24 horas y gcTime a 48 horas", () => {
    const client = createQueryClient();
    const defaultOptions = client.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toBe(oneDay);
    expect(defaultOptions.queries?.staleTime).toBe(24 * 60 * 60 * 1000);
    expect(defaultOptions.queries?.gcTime).toBe(oneDay * 2);
    expect(defaultOptions.queries?.retry).toBe(2);
  });
});
