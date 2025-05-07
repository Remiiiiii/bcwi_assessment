import { ClientTableProps } from "@/types/client";
import { ClientTableRow } from "./ClientTableRow";

export function ClientTable({ clients }: ClientTableProps) {
  const handleDetails = (accountNumber: string) => {
    console.log("View details for account:", accountNumber);
  };

  const handleTransfer = (accountNumber: string) => {
    console.log("Transfer for account:", accountNumber);
  };

  const handleClose = (accountNumber: string) => {
    console.log("Close account:", accountNumber);
  };

  return (
    <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.2)] border w-full max-w-[1278px] overflow-hidden mt-[35px] pt-px pb-[50px] rounded-[10px] border-[rgba(224,214,192,1)] border-solid max-md:max-w-full">
      <table className="w-full">
        <thead>
          <tr className="bg-[rgba(101,0,0,1)] text-base text-white font-normal whitespace-nowrap tracking-[-0.32px]">
            <th className="py-[17px] px-10 text-left">Name</th>
            <th className="py-[17px] px-4 text-center">Birthday</th>
            <th className="py-[17px] px-4 text-center">Type</th>
            <th className="py-[17px] px-4 text-left">Account</th>
            <th className="py-[17px] px-4 text-left">Balance</th>
            <th className="py-[17px] px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <ClientTableRow
              key={client.accountNumber} // Assuming client has accountNumber
              client={client}
              isEven={index % 2 === 0}
              onDetails={handleDetails}
              onTransfer={handleTransfer}
              onClose={handleClose}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
