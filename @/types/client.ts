import { Decimal } from "decimal.js";





export interface Client {
  id: string;
  name: string;
  birthday: Date | null;
  
  
  

  
  checkingAccountNumber: string | null;
  checkingBalance: Decimal | null; 
  savingsAccountNumber: string | null;
  savingsBalance: Decimal | null; 
  displayOrder: number;
  
  
}


export interface ClientTableRowProps {
  client: Client;
  isEven: boolean;
  onDetails: (client: Client) => void;
  onTransfer: (client: Client) => void;
  onClose: (client: Client) => void;
}


export interface ClientTableProps {
  clients: Client[];
  onDetails: (client: Client) => void;
  onTransfer: (client: Client) => void;
  onClose: (client: Client) => void;
}
