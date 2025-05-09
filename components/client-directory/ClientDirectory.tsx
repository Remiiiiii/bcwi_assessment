"use client";

import { useState, useEffect } from "react";
import { ClientTable } from "./ClientTable";
import type { Client } from "@/types/client";
import { Decimal } from "decimal.js";

interface RawApiClient {
  id: string;
  name: string;
  birthday: string | null;
  checkingAccountNumber: string | null;
  checkingBalance: string | null;
  savingsAccountNumber: string | null;
  savingsBalance: string | null;
  displayOrder: number;
}

const getClientPrimaryAccountType = (client: Client): string => {
  const hasChecking =
    client.checkingAccountNumber && client.checkingAccountNumber !== null;
  const hasSavings =
    client.savingsAccountNumber && client.savingsAccountNumber !== null;

  const checkingBalanceForComparison = client.checkingBalance
    ? new Decimal(client.checkingBalance.toString())
    : new Decimal(0);
  const savingsBalanceForComparison = client.savingsBalance
    ? new Decimal(client.savingsBalance.toString())
    : new Decimal(0);

  if (hasChecking && hasSavings) {
    return checkingBalanceForComparison.greaterThanOrEqualTo(
      savingsBalanceForComparison
    )
      ? "Checking"
      : "Savings";
  } else if (hasChecking) {
    return "Checking";
  } else if (hasSavings) {
    return "Savings";
  }
  return "N/A";
};

export function ClientDirectory() {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("All");
  const [nameInput, setNameInput] = useState<string>("");
  const [birthdayInput, setBirthdayInput] = useState<string>("");
  const [searchCriteria, setSearchCriteria] = useState<{
    name: string;
    birthday: string;
    accountType: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        const data: RawApiClient[] = await response.json();

        const transformedData: Client[] = data.map(
          (rawClient: RawApiClient) => {
            return {
              id: rawClient.id,
              name: rawClient.name,
              birthday: rawClient.birthday || "",
              checkingAccountNumber: rawClient.checkingAccountNumber,
              checkingBalance:
                rawClient.checkingBalance !== null
                  ? Number(rawClient.checkingBalance)
                  : null,
              savingsAccountNumber: rawClient.savingsAccountNumber,
              savingsBalance:
                rawClient.savingsBalance !== null
                  ? Number(rawClient.savingsBalance)
                  : null,
              displayOrder: rawClient.displayOrder,
              accountNumber:
                rawClient.checkingAccountNumber ||
                rawClient.savingsAccountNumber ||
                "N/A",
              accountType: rawClient.checkingAccountNumber
                ? "Checking"
                : rawClient.savingsAccountNumber
                ? "Savings"
                : "N/A",
              balance: rawClient.checkingBalance
                ? Number(rawClient.checkingBalance)
                : rawClient.savingsBalance
                ? Number(rawClient.savingsBalance)
                : null,
            };
          }
        );

        setAllClients(transformedData);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred during fetch"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    let clientsToDisplay = allClients;

    if (searchCriteria) {
      clientsToDisplay = allClients.filter((client: Client) => {
        const nameMatch =
          !searchCriteria.name ||
          client.name.toLowerCase().includes(searchCriteria.name.toLowerCase());

        let birthdayMatch = true;
        const clientBirthday = client.birthday;

        if (searchCriteria.birthday && clientBirthday) {
          try {
            const normalizedSearch = searchCriteria.birthday.replace(
              /[-\s]/g,
              "/"
            );
            const normalizedClient = clientBirthday.replace(/[-\s]/g, "/");
            birthdayMatch = normalizedClient === normalizedSearch;
          } catch (parseErr) {
            console.warn(
              "Error parsing birthday input:",
              searchCriteria.birthday,
              parseErr
            );
            birthdayMatch = false;
          }
        } else if (searchCriteria.birthday) {
          birthdayMatch = false;
        }

        const primaryType = getClientPrimaryAccountType(client);
        const accountTypeMatch =
          searchCriteria.accountType === "All" ||
          primaryType === searchCriteria.accountType;

        return nameMatch && birthdayMatch && accountTypeMatch;
      });
    } else {
      if (accountTypeFilter === "All") {
        clientsToDisplay = allClients;
      } else {
        clientsToDisplay = allClients.filter((client) => {
          const primaryType = getClientPrimaryAccountType(client);
          return primaryType === accountTypeFilter;
        });
      }
    }
    setFilteredClients(clientsToDisplay);
  }, [allClients, searchCriteria, accountTypeFilter]);

  const handleSearch = () => {
    setSearchCriteria({
      name: nameInput,
      birthday: birthdayInput,
      accountType: accountTypeFilter,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDetails = (client: Client) => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTransfer = (client: Client) => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClose = (client: Client) => {};

  if (isLoading) {
    return (
      <div className="p-4 text-center font-poppins">Loading clients...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 font-poppins">
        Error loading clients: {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-start gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="nameSearch"
            className="mb-1 text-sm font-medium text-gray-700 font-poppins"
          >
            Search by Name:
          </label>
          <input
            type="text"
            id="nameSearch"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Client Name"
            className="block w-auto px-4 py-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="birthdaySearch"
            className="mb-1 text-sm font-medium text-gray-700 font-poppins"
          >
            Search by Birthday:
          </label>
          <input
            type="text"
            id="birthdaySearch"
            value={birthdayInput}
            onChange={(e) => setBirthdayInput(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="block w-auto px-4 py-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="accountTypeFilter"
            className="mb-1 text-sm font-medium text-gray-700 font-poppins"
          >
            Filter by Account Type:
          </label>
          <select
            id="accountTypeFilter"
            value={accountTypeFilter}
            onChange={(e) => setAccountTypeFilter(e.target.value)}
            className="block w-auto px-4 py-2 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
          >
            <option value="All">All Accounts</option>
            <option value="Checking">Checking Only</option>
            <option value="Savings">Savings Only</option>
          </select>
        </div>

        <div className="flex flex-col self-end">
          <button
            type="button"
            onClick={handleSearch}
            className="px-6 py-2 text-base font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-poppins"
          >
            Search
          </button>
        </div>
      </div>
      {filteredClients.length > 0 ? (
        <ClientTable
          clients={filteredClients}
          onDetails={handleDetails}
          onTransfer={handleTransfer}
          onClose={handleClose}
        />
      ) : (
        <div className="p-4 text-center text-gray-500 font-poppins">
          No clients to display.
        </div>
      )}
    </div>
  );
}
