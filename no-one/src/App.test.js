import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders application header", () => {
  render(<App />);
  expect(
    screen.getByText(/LUCT Lecturer Reporting System/i)
  ).toBeInTheDocument();
});

test("renders report form title", () => {
  render(<App />);
  expect(screen.getByText(/Lecturer Weekly Report Form/i)).toBeInTheDocument();
});
