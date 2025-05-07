export interface Client {
  id: string;
  name: string;
  birthday: string;
  accountType: "Checking" | "Savings";
  accountNumber: string;
  balance: number;
  isActive?: boolean;
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
  onDetails: (accountNumber: string) => void;
  onTransfer: (accountNumber: string) => void;
  onClose: (accountNumber: string) => void;
}

export interface ClientTableRowProps {
  client: Client;
  isEven: boolean;
  onDetails: (accountNumber: string) => void;
  onTransfer: (accountNumber: string) => void;
  onClose: (accountNumber: string) => void; // Completed type signature
}
