import { test, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShopNowButton } from "../ShopNowButton";

afterEach(() => {
  cleanup();
});

test("renders with default label 'Shop Now'", () => {
  render(<ShopNowButton />);
  expect(screen.getByRole("button", { name: "Shop Now" })).toBeDefined();
});

test("renders with custom label", () => {
  render(<ShopNowButton label="Buy Now" />);
  expect(screen.getByRole("button", { name: "Buy Now" })).toBeDefined();
});

test("calls onClick handler when clicked", async () => {
  const handleClick = vi.fn();
  render(<ShopNowButton onClick={handleClick} />);
  await userEvent.click(screen.getByRole("button", { name: "Shop Now" }));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test("does not call onClick when disabled", async () => {
  const handleClick = vi.fn();
  render(<ShopNowButton onClick={handleClick} disabled />);
  await userEvent.click(screen.getByRole("button", { name: "Shop Now" }));
  expect(handleClick).not.toHaveBeenCalled();
});

test("is disabled when disabled prop is set", () => {
  render(<ShopNowButton disabled />);
  const button = screen.getByRole("button", { name: "Shop Now" });
  expect((button as HTMLButtonElement).disabled).toBe(true);
});

test("applies custom className", () => {
  render(<ShopNowButton className="my-custom-class" />);
  const button = screen.getByRole("button", { name: "Shop Now" });
  expect(button.className).toContain("my-custom-class");
});

test("applies shop-now-btn class by default", () => {
  render(<ShopNowButton />);
  const button = screen.getByRole("button", { name: "Shop Now" });
  expect(button.className).toContain("shop-now-btn");
});
