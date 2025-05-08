export interface Client {
  id: string;
  name: string;
  birthday: string;
  checkingAccountNumber: string | null;
  checkingBalance: number | null;
  savingsAccountNumber: string | null;
  savingsBalance: number | null;
  isActive?: boolean;
  accountNumber: string;
  accountType: "Checking" | "Savings" | "N/A";
  balance: number | null;
}

export interface SearchBoxProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  name?: string;
  birthday?: string;
  accountType?: string;
}

export interface ClientTableProps {
  clients: Client[];
  onDetails: (client: Client) => void;
  onTransfer: (client: Client) => void;
  onClose: (client: Client) => void;
}

export interface ClientTableRowProps {
  client: Client;
  isEven: boolean;
  onDetails: (client: Client) => void;
  onTransfer: (client: Client) => void;
  onClose: (client: Client) => void;
}
