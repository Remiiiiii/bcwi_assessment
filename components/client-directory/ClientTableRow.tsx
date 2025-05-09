import { ClientTableRowProps } from "@/types/client";
import { formatDateToMMDDYYYY } from "@/app/lib/dateUtils";
import { Decimal as DecimalJS } from "decimal.js";

export function ClientTableRow({
  client,
  isEven,
  onDetails,
  onTransfer,
  onClose,
}: ClientTableRowProps) {
  let displayAccountType = "N/A";
  let displayAccountNumber = "N/A";
  let displayBalanceSource: DecimalJS | null = null;

  const hasChecking =
    client.checkingAccountNumber && client.checkingAccountNumber !== null;
  const hasSavings =
    client.savingsAccountNumber && client.savingsAccountNumber !== null;

  const checkingBalanceForComparison =
    client.checkingBalance !== null
      ? new DecimalJS(client.checkingBalance.toString())
      : new DecimalJS(0);
  const savingsBalanceForComparison =
    client.savingsBalance !== null
      ? new DecimalJS(client.savingsBalance.toString())
      : new DecimalJS(0);

  let rawBalanceForDisplay: number | string | null = null;

  if (hasChecking && hasSavings) {
    if (
      checkingBalanceForComparison.greaterThanOrEqualTo(
        savingsBalanceForComparison
      )
    ) {
      displayAccountType = "Checking";
      displayAccountNumber = client.checkingAccountNumber!;
      rawBalanceForDisplay = client.checkingBalance;
    } else {
      displayAccountType = "Savings";
      displayAccountNumber = client.savingsAccountNumber!;
      rawBalanceForDisplay = client.savingsBalance;
    }
  } else if (hasChecking) {
    displayAccountType = "Checking";
    displayAccountNumber = client.checkingAccountNumber!;
    rawBalanceForDisplay = client.checkingBalance;
  } else if (hasSavings) {
    displayAccountType = "Savings";
    displayAccountNumber = client.savingsAccountNumber!;
    rawBalanceForDisplay = client.savingsBalance;
  }

  displayBalanceSource =
    rawBalanceForDisplay !== null
      ? new DecimalJS(rawBalanceForDisplay.toString())
      : null;

  console.log(`[ClientTableRow] Client: ${client.name}`);
  console.log(
    `[ClientTableRow] client.checkingBalance (type: ${typeof client.checkingBalance}):`,
    client.checkingBalance
  );
  console.log(
    `[ClientTableRow] client.savingsBalance (type: ${typeof client.savingsBalance}):`,
    client.savingsBalance
  );
  console.log(
    `[ClientTableRow] displayBalanceSource:`,
    displayBalanceSource,
    `instanceof DecimalJS: ${displayBalanceSource instanceof DecimalJS}`
  );
  if (
    displayBalanceSource !== null &&
    !(displayBalanceSource instanceof DecimalJS)
  ) {
    console.warn(
      "[ClientTableRow] displayBalanceSource is not null AND still not an instance of DecimalJS. Type:",
      typeof displayBalanceSource,
      "Constructor:",
      Object.getPrototypeOf(displayBalanceSource)?.constructor?.name
    );
  }

  const formattedBalance =
    displayBalanceSource instanceof DecimalJS
      ? `$${Number(displayBalanceSource.toString()).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "N/A";

  return (
    <tr className={!isEven ? "bg-neutral-100" : ""}>
      <td className="py-3 pl-10 pr-4 text-[rgba(119,119,119,1)] text-base font-normal poppins-thin">
        {client.name}
      </td>
      <td className="py-3 px-4 text-center text-[rgba(119,119,119,1)] text-base poppins-thin">
        {client.birthday ? formatDateToMMDDYYYY(client.birthday) : "N/A"}
      </td>
      <td className="py-3 px-4 text-center text-[rgba(119,119,119,1)] text-base poppins-thin">
        {displayAccountType}
      </td>
      <td className="py-3 px-4 text-[rgba(119,119,119,1)] text-base poppins-thin">
        {displayAccountNumber}
      </td>
      <td className="py-3 px-4 text-[rgba(119,119,119,1)] text-base font-bold poppins-thin-bold">
        {formattedBalance}
      </td>
      <td className="py-3 pr-10 pl-4 text-center text-[rgba(101,0,0,1)] text-base font-normal poppins-thin">
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
