import { transformClientData, ApiClientData } from "./clientDataTransformer";
// import { Client as FrontendClientType } from "@/types/client"; // Unused import

describe("transformClientData", () => {
  const baseApiClient: ApiClientData = {
    id: "1",
    name: "Test User",
    birthday: "01/01/1990",
    checkingAccountNumber: "1234567890123",
    checkingBalance: "1000.50",
    savingsAccountNumber: "9876543210987",
    savingsBalance: 5000.75, // Test with number type as well
    isActive: true,
  };

  it("should prioritize checking account when searchedAccountType is Checking", () => {
    const result = transformClientData(baseApiClient, "Checking");
    expect(result.accountNumber).toBe("1234567890123");
    expect(result.accountType).toBe("Checking");
    expect(result.balance).toBe(1000.5);
  });

  it("should prioritize savings account when searchedAccountType is Savings", () => {
    const result = transformClientData(baseApiClient, "Savings");
    expect(result.accountNumber).toBe("9876543210987");
    expect(result.accountType).toBe("Savings");
    expect(result.balance).toBe(5000.75);
  });

  it("should default to checking account if no searchedAccountType and checking exists", () => {
    const result = transformClientData(baseApiClient);
    expect(result.accountNumber).toBe("1234567890123");
    expect(result.accountType).toBe("Checking");
    expect(result.balance).toBe(1000.5);
  });

  it("should default to savings account if no searchedAccountType and only savings exists", () => {
    const onlySavingsClient: ApiClientData = {
      ...baseApiClient,
      checkingAccountNumber: null,
      checkingBalance: null,
    };
    const result = transformClientData(onlySavingsClient);
    expect(result.accountNumber).toBe("9876543210987");
    expect(result.accountType).toBe("Savings");
    expect(result.balance).toBe(5000.75);
  });

  it("should handle null balances correctly", () => {
    const clientWithNullBalances: ApiClientData = {
      ...baseApiClient,
      checkingBalance: null,
      savingsBalance: null,
    };
    const resultChecking = transformClientData(
      clientWithNullBalances,
      "Checking"
    );
    expect(resultChecking.balance).toBeNull();
    const resultSavings = transformClientData(
      clientWithNullBalances,
      "Savings"
    );
    expect(resultSavings.balance).toBeNull();
  });

  it("should handle client with only checking account", () => {
    const onlyCheckingClient: ApiClientData = {
      ...baseApiClient,
      savingsAccountNumber: null,
      savingsBalance: null,
    };
    const result = transformClientData(onlyCheckingClient, "Checking");
    expect(result.accountNumber).toBe("1234567890123");
    expect(result.accountType).toBe("Checking");
    expect(result.balance).toBe(1000.5);

    const resultFallback = transformClientData(onlyCheckingClient);
    expect(resultFallback.accountNumber).toBe("1234567890123");
    expect(resultFallback.accountType).toBe("Checking");
    expect(resultFallback.balance).toBe(1000.5);

    // If specifically searching for Savings, and it doesn't exist, it should fallback to checking
    const resultSearchMissingSavings = transformClientData(
      onlyCheckingClient,
      "Savings"
    );
    expect(resultSearchMissingSavings.accountNumber).toBe("1234567890123");
    expect(resultSearchMissingSavings.accountType).toBe("Checking");
    expect(resultSearchMissingSavings.balance).toBe(1000.5);
  });

  it("should handle client with no accounts", () => {
    const noAccountsClient: ApiClientData = {
      ...baseApiClient,
      checkingAccountNumber: null,
      checkingBalance: null,
      savingsAccountNumber: null,
      savingsBalance: null,
    };
    const result = transformClientData(noAccountsClient);
    expect(result.accountNumber).toBe("");
    // The type assertion for finalAccountType might cause issues here if it's strictly Checking | Savings
    // Let's check the actual type definition of FrontendClientType for accountType
    // For now, assuming it can handle N/A or we adjust the function to ensure it fits FrontendClientType
    // Based on current FrontendClientType, it must be 'Checking' or 'Savings'.
    // The transform function has a `finalAccountType` which will cast "N/A" to one of these.
    // This might be a point of failure or require adjustment in transformClientData or FrontendClientType if N/A is a valid state.
    // Given `finalAccountType = accountTypeDisplay as "Checking" | "Savings";` this case is tricky.
    // The current transform logic will likely pick one if the other is null, and if both are null, accountTypeDisplay remains "N/A"
    // which then gets cast. This test will likely fail on accountType or needs the function to handle N/A more gracefully for the return type.
    // For the purpose of this test, if accountType must be Checking/Savings, this case implies an issue in transform or type def.
    // Let's assume the transform function's current cast `as "Checking" | "Savings"` is intentional.
    // Then, accountTypeDisplay being N/A will lead to an unsafe cast.
    // We should adjust the transform function or the FrontendClientType to allow for "N/A".
    // Given the current types, the test for accountType will be difficult if accountNumber is "".
    // Let's expect what the current logic produces which is a cast from "N/A".
    // Now that we allow "N/A" in the type and removed the cast, we expect "N/A"
    expect(result.accountType).toBe("N/A");
    expect(result.balance).toBeNull();
  });

  it("should correctly parse string balances to numbers", () => {
    const clientWithStringBalances: ApiClientData = {
      ...baseApiClient,
      checkingBalance: "1234.56",
      savingsBalance: "7890.12",
    };
    const result = transformClientData(clientWithStringBalances, "Checking");
    expect(result.balance).toBe(1234.56);
    const resultSavings = transformClientData(
      clientWithStringBalances,
      "Savings"
    );
    expect(resultSavings.balance).toBe(7890.12);
  });

  it("should default isActive to true if not provided", () => {
    const clientWithoutIsActive: ApiClientData = {
      id: "2",
      name: "No Active User",
      birthday: "02/02/1992",
      checkingAccountNumber: "1112223334444",
      checkingBalance: "200",
      savingsAccountNumber: null,
      savingsBalance: null,
      // isActive is omitted
    };
    const result = transformClientData(clientWithoutIsActive);
    expect(result.isActive).toBe(true);
  });

  it("should use provided isActive value", () => {
    const clientWithIsActiveFalse: ApiClientData = {
      ...baseApiClient,
      isActive: false,
    };
    const result = transformClientData(clientWithIsActiveFalse);
    expect(result.isActive).toBe(false);
  });
});
