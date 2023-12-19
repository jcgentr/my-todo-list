import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

test("App Router: Works with Server Components", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 1, name: "My Todo List" })
  ).toBeDefined();
});

test("should show existing todos", () => {
  render(<Page />);
  const listItem = screen.getByText("buy milk");
  expect(listItem).toBeInTheDocument();
});

test("should show correct empty state", () => {
  render(<Page />);
  const emptyStateText = screen.getByText(
    "Either you've done everything already or there are still things to add to your list. Add your first todo ↓"
  );
  expect(emptyStateText).toBeInTheDocument();
});
