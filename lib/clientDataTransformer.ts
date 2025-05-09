import { Client as FrontendClientType } from "@/types/client";



export interface ApiClientData {
  id: string;
  name: string;
  birthday: string;
  checkingAccountNumber: string | null;
  checkingBalance: string | number | null; 
  savingsAccountNumber: string | null;
  savingsBalance: string | number | null; 
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
    accountNumber: accountNumber, 
    accountType: accountTypeDisplay, 
    balance: balanceDisplay, 
  };
};
