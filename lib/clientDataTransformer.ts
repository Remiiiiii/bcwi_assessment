import { Client as FrontendClientType } from "@/types/client";

// Type for data coming from the API, which is JSONified Prisma data
// Balance will be string or number, type will be string representation of enum
export interface ApiClientData {
  id: string;
  name: string;
  birthday: string;
  checkingAccountNumber: string | null;
  checkingBalance: string | number | null; // API might send as string or number
  savingsAccountNumber: string | null;
  savingsBalance: string | number | null; // API might send as string or number
  isActive?: boolean;
}

export const transformClientData = (
  apiClient: ApiClientData,
  searchedAccountType?: "Checking" | "Savings"
): FrontendClientType => {
  let accountNumber = "";
  let accountTypeDisplay: "Checking" | "Savings" | "N/A" = "N/A";
  let balanceDisplay: number | null = null;

  const checkingBalanceNum =
    apiClient.checkingBalance !== null
      ? parseFloat(String(apiClient.checkingBalance))
      : null;
  const savingsBalanceNum =
    apiClient.savingsBalance !== null
      ? parseFloat(String(apiClient.savingsBalance))
      : null;

  if (searchedAccountType === "Savings" && apiClient.savingsAccountNumber) {
    accountNumber = apiClient.savingsAccountNumber;
    accountTypeDisplay = "Savings";
    balanceDisplay = savingsBalanceNum;
  } else if (
    searchedAccountType === "Checking" &&
    apiClient.checkingAccountNumber
  ) {
    accountNumber = apiClient.checkingAccountNumber;
    accountTypeDisplay = "Checking";
    balanceDisplay = checkingBalanceNum;
  } else {
    if (apiClient.checkingAccountNumber) {
      accountNumber = apiClient.checkingAccountNumber;
      accountTypeDisplay = "Checking";
      balanceDisplay = checkingBalanceNum;
    } else if (apiClient.savingsAccountNumber) {
      accountNumber = apiClient.savingsAccountNumber;
      accountTypeDisplay = "Savings";
      balanceDisplay = savingsBalanceNum;
    }
  }

  return {
    id: apiClient.id,
    name: apiClient.name,
    birthday: apiClient.birthday,
    checkingAccountNumber: apiClient.checkingAccountNumber,
    checkingBalance: checkingBalanceNum,
    savingsAccountNumber: apiClient.savingsAccountNumber,
    savingsBalance: savingsBalanceNum,
    isActive: apiClient.isActive ?? true,
    accountNumber: accountNumber, // Use the prioritized account number
    accountType: accountTypeDisplay, // Use the correctly typed value
    balance: balanceDisplay, // Use the prioritized balance
  };
};
