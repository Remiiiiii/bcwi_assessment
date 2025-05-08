import { ClientTableRowProps } from "@/types/client";
import { formatDateToMMDDYYYY } from "@/app/lib/dateUtils";

export function ClientTableRow({
  client,
  isEven,
  onDetails,
  onTransfer,
  onClose,
}: ClientTableRowProps) {
  return (
    <tr className={!isEven ? "bg-neutral-100" : ""}>
      <td className="py-3 pl-10 pr-4 text-[rgba(119,119,119,1)] text-base font-normal">
        {client.name}
      </td>
      <td className="py-3 px-4 text-center text-[rgba(119,119,119,1)] text-base font-normal">
        {formatDateToMMDDYYYY(client.birthday)}
      </td>
      <td className="py-3 px-4 text-center text-[rgba(119,119,119,1)] text-base font-normal">
        {client.accountType}
      </td>
      <td className="py-3 px-4 text-[rgba(119,119,119,1)] text-base font-normal">
        {client.accountNumber}
      </td>
      <td className="py-3 px-4 text-[rgba(119,119,119,1)] text-base font-bold">
        {client.balance !== null
          ? `$${client.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}`
          : "N/A"}
      </td>
      <td className="py-3 pr-10 pl-4 text-center text-[rgba(101,0,0,1)] text-base font-normal">
        <button
          onClick={() => onDetails(client)}
          className="hover:underline mr-2"
        >
          Details
        </button>
        |
        <button
          onClick={() => onTransfer(client)}
          className="hover:underline mx-2"
        >
          Transfer
        </button>
        |
        <button
          onClick={() => onClose(client)}
          className="hover:underline ml-2"
        >
          Close Account
        </button>
      </td>
    </tr>
  );
}
