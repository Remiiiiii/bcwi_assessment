"use client";

import React, { useState, useEffect } from "react";
import { Session } from "next-auth";
// import { Client as PrismaClientType } from "../generated/prisma"; // No longer needed
import { SearchBox } from "@/components/client-directory/SearchBox";
import { ClientTable } from "@/components/client-directory/ClientTable";
import { Client as FrontendClientType, SearchFilters } from "@/types/client"; // Uncommented and types should now match
import { useRouter } from "next/navigation";
// Removed Radix and Shadcn/UI imports that were added in previous steps
// const Modal = ... // custom modal was deleted
// Shadcn/UI Dialog components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
// Shadcn/UI Button (and others for transfer form later)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ApiClientData,
  transformClientData,
} from "@/lib/clientDataTransformer"; // Added import
import { signOut } from "next-auth/react"; // Import signOut from next-auth/react

export default function AdminDashboardPage() {
  const router = useRouter();
  const [clients, setClients] = useState<FrontendClientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Modal States
  const [selectedClient, setSelectedClient] =
    useState<FrontendClientType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCloseConfirmModalOpen, setIsCloseConfirmModalOpen] = useState(false);

  // State for Transfer Form - Re-adding this
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferFromAccount, setTransferFromAccount] = useState<
    "checking" | "savings" | ""
  >("");
  const [transferToAccount, setTransferToAccount] = useState<
    "checking" | "savings" | ""
  >("");
  const [transferError, setTransferError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchSessionAndClients = async () => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        // 1. Fetch session
        const sessionRes = await fetch("/api/auth/session");
        if (!isMounted) return;
        const sessionData = await sessionRes.json();
        if (!isMounted) return;

        if (Object.keys(sessionData).length === 0) {
          // No session, redirect to login
          if (isMounted) router.push("/login");
          return; // finally will set isLoading to false
        }

        // Session exists
        if (isMounted) setCurrentSession(sessionData);

        // 2. Fetch initial clients (only if session was successful)
        const initialAccountType: "Checking" | "Savings" = "Checking";
        const clientsRes = await fetch(
          `/api/clients?activeOnly=true&accountType=${initialAccountType}`
        );
        if (!isMounted) return;

        if (!clientsRes.ok) {
          // Failed to fetch clients, but session was okay. Show error, don't redirect.
          console.error("Failed to fetch clients:", await clientsRes.text());
          if (isMounted) {
            toast.error("Error: Could not load client data. Please refresh.");
            setClients([]); // Show an empty state or error message in UI
          }
        } else {
          const initialApiClients: ApiClientData[] = await clientsRes.json();
          if (isMounted) {
            setClients(
              initialApiClients.map((client) =>
                transformClientData(client, initialAccountType)
              )
            );
          }
        }
      } catch (error) {
        // Catch any other errors (e.g., network issues with fetch itself)
        if (isMounted) {
          console.error(
            "Critical error during initial data load:",
            error as Error
          );
          toast.error("An unexpected error occurred. Redirecting to login.");
          router.push("/login");
        }
        return; // finally will set isLoading to false
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSessionAndClients();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [router]);

  // useEffect for resetting transfer form - Re-adding this
  useEffect(() => {
    if (!isTransferModalOpen) {
      setTransferAmount("");
      setTransferFromAccount("");
      setTransferToAccount("");
      setTransferError(null);
    }
  }, [isTransferModalOpen]); // Only depends on isTransferModalOpen

  const handleSearch = async (params: SearchFilters) => {
    console.log("Search parameters:", params);
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.name) query.append("name", params.name);
      if (params.birthday) query.append("birthday", params.birthday);
      // params.accountType will be 'Checking' or 'Savings' due to SearchBox changes
      if (params.accountType) query.append("accountType", params.accountType);
      query.append("activeOnly", "true");

      const response = await fetch(`/api/clients?${query.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients during search");
      }
      const searchedApiClients: ApiClientData[] = await response.json();
      // Pass the searched accountType to the transformer, ensuring it's a valid literal or undefined
      const typeToTransform =
        params.accountType === "Checking" || params.accountType === "Savings"
          ? params.accountType
          : undefined;
      setClients(
        searchedApiClients.map((client) =>
          transformClientData(client, typeToTransform)
        )
      );
    } catch (error) {
      console.error("Error searching clients:", error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailsModal = (client: FrontendClientType) => {
    console.log("[Handler] openDetailsModal called for client:", client.id);
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
    console.log(
      "[Handler] State after setting: isDetailsModalOpen=true, selectedClient set"
    );
  };

  const openTransferModal = (client: FrontendClientType) => {
    console.log("[Handler] openTransferModal called for client:", client.id);
    setSelectedClient(client);
    setIsTransferModalOpen(true);
    console.log(
      "[Handler] State after setting: isTransferModalOpen=true, selectedClient set"
    );
  };

  const openCloseConfirmModal = (client: FrontendClientType) => {
    console.log(
      "[Handler] openCloseConfirmModal called for client:",
      client.id
    );
    setSelectedClient(client);
    setIsCloseConfirmModalOpen(true);
    console.log(
      "[Handler] State after setting: isCloseConfirmModalOpen=true, selectedClient set"
    );
  };

  const closeAllModals = () => {
    console.log("[Handler] closeAllModals called");
    setIsDetailsModalOpen(false);
    setIsTransferModalOpen(false);
    setIsCloseConfirmModalOpen(false);
    setSelectedClient(null);
  };

  // This function will be called from the confirmation modal
  const confirmCloseAccount = async () => {
    if (!selectedClient) return;

    console.log("Confirm close account:", selectedClient.id);
    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to close account");
      }
      setClients(clients.filter((client) => client.id !== selectedClient.id));
      toast.success(`Account for ${selectedClient.name} closed successfully.`);
    } catch (error) {
      console.error("Error closing account:", error as Error);
      toast.error(`Error closing account: ${(error as Error).message}`);
    }
    closeAllModals(); // Close modal after action
  };

  // handleTransferSubmit function - Re-adding this
  const handleTransferSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(
      "[TransferSubmit] Initial transferAmount string from state:",
      transferAmount
    );
    setTransferError(null);
    if (
      !selectedClient ||
      !transferFromAccount ||
      !transferToAccount ||
      !transferAmount
    ) {
      setTransferError("All fields are required for transfer.");
      return;
    }
    if (transferFromAccount === transferToAccount) {
      setTransferError("Cannot transfer to the same account type.");
      return;
    }
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setTransferError("Invalid transfer amount. Must be a positive number.");
      return;
    }

    // Check for more than two decimal places on the original input string
    if (
      transferAmount.includes(".") &&
      transferAmount.split(".")[1].length > 2
    ) {
      setTransferError(
        "Invalid transfer amount. Cannot have more than two decimal places."
      );
      return;
    }

    // New balance check
    let fromAccountBalance: number | null = null;
    if (transferFromAccount === "checking") {
      fromAccountBalance = selectedClient.checkingBalance;
    } else if (transferFromAccount === "savings") {
      fromAccountBalance = selectedClient.savingsBalance;
    }

    if (fromAccountBalance === null || amount > fromAccountBalance) {
      setTransferError("Insufficient funds in the selected account.");
      return;
    }

    try {
      const response = await fetch(
        `/api/clients/${selectedClient.id}/transfer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            fromAccountType: transferFromAccount,
            toAccountType: transferToAccount,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Transfer API call failed");
      }
      const updatedClientAPI = await response.json();
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === updatedClientAPI.id
            ? transformClientData(updatedClientAPI)
            : c
        )
      );
      toast.success("Transfer successful!");
      closeAllModals();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTransferError(err.message);
      } else {
        setTransferError("An unexpected error occurred during transfer.");
      }
    }
  };

  // Log state just before rendering
  console.log(
    "[Render] Modal states:",
    { isDetailsModalOpen, isTransferModalOpen, isCloseConfirmModalOpen },
    "Selected Client:",
    selectedClient?.id || null
  );

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
          <h1 className="text-2xl font-semibold poppins-medium text-gray-700 ml-5">
            Admin Client Dashboard
          </h1>
          <button
            onClick={async () => {
              try {
                console.log(
                  "Attempting to sign out using next-auth/react signOut..."
                );
                // Use the client-side signOut function
                await signOut({ redirect: false });

                console.log(
                  "Client-side signOut processed. Navigating to /..."
                );
                toast.success("Logged out successfully!");
                window.location.assign("/"); // Navigate after signOut completes
              } catch (error) {
                console.error("Error during client-side signOut:", error);
                toast.error("An error occurred during logout.");
                // Fallback navigation if signOut itself fails catastrophically before redirecting
                window.location.assign("/");
              }
            }}
            className="md:mr-[25px] px-4 py-2 bg-[#650000] text-white rounded hover:bg-red-600"
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
            <p className="text-center text-gray-500">No clients found</p>
          ) : clients.length > 0 && currentSession ? (
            <ClientTable
              clients={clients}
              onDetails={openDetailsModal}
              onTransfer={openTransferModal}
              onClose={openCloseConfirmModal}
            />
          ) : null}
        </div>

        {/* Details Modal using Shadcn/UI Dialog */}
        {selectedClient && isDetailsModalOpen && (
          <Dialog
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Client Details</DialogTitle>
                <DialogDescription>
                  Detailed information for {selectedClient.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={selectedClient.name}
                    readOnly
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birthday" className="text-right">
                    Birthday
                  </Label>
                  <Input
                    id="birthday"
                    value={selectedClient.birthday}
                    readOnly
                    className="col-span-3"
                  />
                </div>
                {selectedClient.checkingAccountNumber && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="checkingAccount" className="text-right">
                        Checking Acc.
                      </Label>
                      <Input
                        id="checkingAccount"
                        value={selectedClient.checkingAccountNumber}
                        readOnly
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="checkingBalance" className="text-right">
                        Checking Bal.
                      </Label>
                      <Input
                        id="checkingBalance"
                        value={
                          selectedClient.checkingBalance?.toFixed(2) ?? "N/A"
                        }
                        readOnly
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
                {selectedClient.savingsAccountNumber && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="savingsAccount" className="text-right">
                        Savings Acc.
                      </Label>
                      <Input
                        id="savingsAccount"
                        value={selectedClient.savingsAccountNumber}
                        readOnly
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="savingsBalance" className="text-right">
                        Savings Bal.
                      </Label>
                      <Input
                        id="savingsBalance"
                        value={
                          selectedClient.savingsBalance?.toFixed(2) ?? "N/A"
                        }
                        readOnly
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button onClick={closeAllModals} variant="outline">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Transfer Modal using Shadcn/UI Dialog - Ensuring form is present */}
        {selectedClient && (
          <Dialog
            open={isTransferModalOpen}
            onOpenChange={(isOpen: boolean) => !isOpen && closeAllModals()}
          >
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>
                  Transfer Funds for {selectedClient.name}
                </DialogTitle>
                <DialogDescription>
                  Specify transfer details below. Client ID: {selectedClient.id}
                </DialogDescription>
              </DialogHeader>
              <hr className="border-t border-gray-300 my-2"></hr>

              <form onSubmit={handleTransferSubmit} className="space-y-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="transferAmount">Amount</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    value={transferAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTransferAmount(e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="transferFrom">From Account</Label>
                  <Select
                    value={transferFromAccount}
                    onValueChange={(value: "checking" | "savings" | "") =>
                      setTransferFromAccount(value)
                    }
                  >
                    <SelectTrigger id="transferFrom">
                      <SelectValue placeholder="Select account to transfer from" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedClient?.checkingAccountNumber && (
                        <SelectItem value="checking">{`Checking (${
                          selectedClient.checkingAccountNumber
                        }) - Bal: $${selectedClient.checkingBalance?.toFixed(
                          2
                        )}`}</SelectItem>
                      )}
                      {selectedClient?.savingsAccountNumber && (
                        <SelectItem value="savings">{`Savings (${
                          selectedClient.savingsAccountNumber
                        }) - Bal: $${selectedClient.savingsBalance?.toFixed(
                          2
                        )}`}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="transferTo">To Account</Label>
                  <Select
                    value={transferToAccount}
                    onValueChange={(value: "checking" | "savings" | "") =>
                      setTransferToAccount(value)
                    }
                  >
                    <SelectTrigger id="transferTo">
                      <SelectValue placeholder="Select account to transfer to" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedClient?.checkingAccountNumber &&
                        transferFromAccount !== "checking" && (
                          <SelectItem value="checking">{`Checking (${selectedClient.checkingAccountNumber})`}</SelectItem>
                        )}
                      {selectedClient?.savingsAccountNumber &&
                        transferFromAccount !== "savings" && (
                          <SelectItem value="savings">{`Savings (${selectedClient.savingsAccountNumber})`}</SelectItem>
                        )}
                    </SelectContent>
                  </Select>
                </div>
                {transferError && (
                  <p className="text-sm text-red-500">{transferError}</p>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeAllModals}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Submit Transfer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Close Account Confirmation Modal using Shadcn/UI Dialog */}
        {selectedClient && (
          <Dialog
            open={isCloseConfirmModalOpen}
            onOpenChange={(isOpen) => !isOpen && closeAllModals()}
          >
            <DialogContent className="w-[400px] sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Confirm Close Account: {selectedClient.name}
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to close the account for{" "}
                  {selectedClient.name}? This action will mark the client as
                  inactive.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeAllModals}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={confirmCloseAccount}
                  >
                    Yes, Close Account
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}

// This page now primarily acts as a client component.
// For optimal Next.js patterns with RSC, you might have a root server component
// that fetches initial data and session, then passes it to this client component.
// For simplicity in this step, we're fetching session and initial clients client-side.
