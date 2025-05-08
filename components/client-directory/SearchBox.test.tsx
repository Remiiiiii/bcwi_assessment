import { render, screen, within } from "@testing-library/react";
import { SearchBox } from "./SearchBox";

describe("SearchBox component", () => {
  const mockOnSearch = jest.fn();

  it("should render the Client Directory heading", () => {
    render(<SearchBox onSearch={mockOnSearch} />);
    const headings = screen.getAllByText(/Client Directory/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it("should render the Name input field", () => {
    render(<SearchBox onSearch={mockOnSearch} />);
    const nameLabel = screen.getByText("Name");
    expect(nameLabel).toBeInTheDocument();
    const nameInput = screen.getByRole("textbox", { name: /name/i });
    expect(nameInput).toBeInTheDocument();
  });

  it("should render the Birthday input field", () => {
    render(<SearchBox onSearch={mockOnSearch} />);
    const birthdayLabel = screen.getByText("Birthday");
    expect(birthdayLabel).toBeInTheDocument();
    const birthdayInput = screen.getByPlaceholderText("MM/DD/YYYY");
    expect(birthdayInput).toBeInTheDocument();
  });

  it("should render the Account Type select field", () => {
    render(<SearchBox onSearch={mockOnSearch} />);
    const accountTypeLabel = screen.getByText("Account Type");
    expect(accountTypeLabel).toBeInTheDocument();

    const accountTypeSelect = screen.getByRole("combobox");
    expect(accountTypeSelect).toBeInTheDocument();
    const trigger = screen.getByRole("combobox", { name: "Account Type" });
    expect(within(trigger).getByText("Checking")).toBeInTheDocument();
  });

  it("should render the Search button", () => {
    render(<SearchBox onSearch={mockOnSearch} />);
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeInTheDocument();
  });
});
