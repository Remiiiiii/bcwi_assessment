"use client";

import React, { useState, useEffect } from "react";
import { Session } from "next-auth";
// import { Client as PrismaClientType } from "../generated/prisma"; // No longer needed
import { SearchBox } from "@/components/client-directory/SearchBox";
import { ClientTable } from "@/components/client-directory/ClientTable";
import { Client as FrontendClientType, SearchFilters } from "@/types/client";
import { useRouter } from "next/navigation";

// Type for data coming from the API, which is JSONified Prisma data
// Balance will be string or number, type will be string representation of enum
interface ApiClientData {
  id: string;
  name: string;
  birthday: string;
  type: string; // e.g., "SAVINGS" or "CHECKING"
  account: string;
  balance: string | number;
  isActive?: boolean;
  // Add other fields that are expected from the API and used in transformClientData
}

const transformClientData = (
  apiClient: ApiClientData // Changed from PrismaClientType
): FrontendClientType => {
  let frontendAccountType: "Checking" | "Savings";
  if (apiClient.type === "SAVINGS") {
    frontendAccountType = "Savings";
  } else if (apiClient.type === "CHECKING") {
    frontendAccountType = "Checking";
  } else {
    console.warn("Unexpected account type from API data:", apiClient.type);
    frontendAccountType = "Checking"; // Default or throw an error
  }

  return {
    id: apiClient.id,
    name: apiClient.name,
    birthday: apiClient.birthday,
    accountType: frontendAccountType,
    accountNumber: apiClient.account,
    balance: parseFloat(String(apiClient.balance)), // Robust parsing
    isActive: apiClient.isActive ?? true,
  };
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [clients, setClients] = useState<FrontendClientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSessionAndClients = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const sessionData = await res.json();
        if (Object.keys(sessionData).length === 0) {
          router.push("/login");
          return;
        }
        setCurrentSession(sessionData);

        const clientsRes = await fetch("/api/clients?activeOnly=true");
        if (!clientsRes.ok) {
          throw new Error("Failed to fetch clients");
        }
        const initialApiClients: ApiClientData[] = await clientsRes.json();
        setClients(initialApiClients.map(transformClientData));
      } catch (error) {
        console.error("Error fetching initial data:", error as Error);
        if (
          (error as Error).message.includes("fetch clients") || // More general check
          confirm(
            "Failed to load client data. You will be redirected to login."
          )
        ) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionAndClients();
  }, [router]);

  const handleSearch = async (params: SearchFilters) => {
    console.log("Search parameters:", params);
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.name) query.append("name", params.name);
      if (params.birthday) query.append("birthday", params.birthday);
      if (params.accountType) query.append("type", params.accountType);
      query.append("activeOnly", "true");

      const response = await fetch(`/api/clients?${query.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients during search");
      }
      const searchedApiClients: ApiClientData[] = await response.json();
      setClients(searchedApiClients.map(transformClientData));
    } catch (error) {
      console.error("Error searching clients:", error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetails = (accountNumber: string) => {
    console.log("Details for account:", accountNumber);
    const client = clients.find((c) => c.accountNumber === accountNumber);
    if (client) {
      router.push(`/admindashboard/clients/${client.id}`);
    } else {
      console.warn("Client not found for account number:", accountNumber);
    }
  };

  const handleTransfer = (accountNumber: string) => {
    console.log("Transfer for account:", accountNumber);
    const client = clients.find((c) => c.accountNumber === accountNumber);
    if (client) {
      alert(
        `Mock transfer initiated for account: ${accountNumber} (Client ID: ${client.id})`
      );
    } else {
      console.warn("Client not found for transfer:", accountNumber);
    }
  };

  const handleCloseAccount = async (accountNumber: string) => {
    console.log("Close account:", accountNumber);
    const clientToClose = clients.find(
      (c) => c.accountNumber === accountNumber
    );
    if (!clientToClose) {
      console.error("Client not found for closing:", accountNumber);
      return;
    }

    if (
      confirm(
        `Are you sure you want to close account ${accountNumber} (ID: ${clientToClose.id})?`
      )
    ) {
      try {
        const response = await fetch(`/api/clients/${clientToClose.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: false }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to close account");
        }
        setClients(clients.filter((client) => client.id !== clientToClose.id));
        alert(`Account ${accountNumber} closed successfully.`);
      } catch (error) {
        console.error("Error closing account:", error as Error);
        alert(`Error closing account: ${(error as Error).message}`);
      }
    }
  };

  if (!currentSession && isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        Loading session...
      </div>
    );
  }

  if (!currentSession && !isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-700">
            Admin Client Dashboard
          </h1>
          <button
            onClick={async () => {
              await fetch("/api/auth/signout", { method: "POST" });
              router.push("/login");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <SearchBox onSearch={handleSearch} />
        <div className="mt-8">
          {isLoading && clients.length === 0 && currentSession ? (
            <p className="text-center text-gray-500">Loading clients...</p>
          ) : !isLoading && clients.length === 0 && currentSession ? (
            <p className="text-center text-gray-500">
              No clients found. Try a different search or add new clients.
            </p>
          ) : clients.length > 0 && currentSession ? (
            <ClientTable
              clients={clients}
              onDetails={handleDetails}
              onTransfer={handleTransfer}
              onClose={handleCloseAccount}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}

// This page now primarily acts as a client component.
// For optimal Next.js patterns with RSC, you might have a root server component
// that fetches initial data and session, then passes it to this client component.
// For simplicity in this step, we're fetching session and initial clients client-side.
