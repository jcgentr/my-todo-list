import { vi } from "vitest";
import "vitest-dom/extend-expect";
// Disables a package that checks that code is only executed on the server side.
// Also, this mock can be defined in the Vitest setup file.
vi.mock("server-only", () => {
  return {};
});
