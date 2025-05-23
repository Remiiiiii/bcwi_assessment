import { ClientTableProps } from "@/types/client";
import { ClientTableRow } from "./ClientTableRow";

export function ClientTable({
  clients,
  onDetails,
  onTransfer,
  onClose,
}: ClientTableProps) {
  return (
    <div className="bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.2)] border w-full max-w-[1198px] mx-auto overflow-x-auto mt-[35px] pt-px pb-[5px] rounded-[10px] border-[rgba(224,214,192,1)] border-solid max-md:max-w-full">
      <table className="w-full">
        <thead>
          <tr className="bg-[rgba(101,0,0,1)] text-white poppins-thin text-base whitespace-nowrap tracking-[-0.32px]">
            <th className="py-[17px] pl-10 pr-4 text-left font-normal">Name</th>
            <th className="py-[17px] px-4 text-center font-normal">Birthday</th>
            <th className="py-[17px] px-4 text-center font-normal">Type</th>
            <th className="py-[17px] px-4 text-left font-normal">Account</th>
            <th className="py-[17px] px-4 text-left font-normal">Balance</th>
            <th className="py-[17px] pr-10 pl-4 text-center font-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <ClientTableRow
              key={client.id}
              client={client}
              isEven={index % 2 === 0}
              onDetails={onDetails}
              onTransfer={onTransfer}
              onClose={onClose}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
