import { ClientTableRowProps } from "@/types/client";

export function ClientTableRow({
  client,
  isEven,
  onDetails,
  onTransfer,
  onClose,
}: ClientTableRowProps) {
  return (
    <tr className={isEven ? "bg-neutral-100" : ""}>
      <td className="py-3 px-4 text-[rgba(119,119,119,1)] text-base font-normal">
        {client.name}
      </td>
      <td className="py-3 px-4 text-center text-[rgba(119,119,119,1)] text-base font-normal">
        {client.birthday}
      </td>
      <td className="py-3 px-4 text-center text-[rgba(119,119,119,1)] text-base font-normal">
        {client.accountType}
      </td>
      <td className="py-3 px-4 text-[rgba(119,119,119,1)] text-base font-normal">
        {client.accountNumber}
      </td>
      <td className="py-3 px-4 text-[rgba(119,119,119,1)] text-base font-bold">
        ${client.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </td>
      <td className="py-3 px-4 text-right text-[rgba(101,0,0,1)] text-base font-normal">
        <button
          onClick={() => onDetails(client.accountNumber)}
          className="hover:underline"
        >
          Details
        </button>
        {" l "}
        <button
          onClick={() => onTransfer(client.accountNumber)}
          className="hover:underline"
        >
          Transfer
        </button>
        {" l "}
        <button
          onClick={() => onClose(client.accountNumber)}
          className="hover:underline"
        >
          Close Account
        </button>
      </td>
    </tr>
  );
}
