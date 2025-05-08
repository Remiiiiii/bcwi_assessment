// Import the handler function we want to test
import { DELETE } from "./route"; // Assuming DELETE is exported from the route file
import { NextRequest } from "next/server";
// import { Session } from "next-auth"; // Unused for now

// --- Mock Prisma Client ---
const mockPrismaClientUpdate = jest.fn();
const mockPrismaClientFindMany = jest.fn(); // For consistency
// Add other specific prisma method mocks if needed for GET/PUT tests in this file
const mockPrismaClientFindUnique = jest.fn();

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    // prisma instance is the default export
    // client: { // NO - methods are directly on the prisma instance
    update: mockPrismaClientUpdate,
    findMany: mockPrismaClientFindMany,
    findUnique: mockPrismaClientFindUnique, // Add findUnique if GET/PUT use it
    // Add other client methods if they are used and need mocking for other handlers (GET, PUT)
    // },
  },
}));

// --- Mock Auth ---
jest.mock("../../auth/[...nextauth]/route", () => ({
  auth: jest.fn(),
}));

// --- Mock Next/Server ---
jest.mock("next/server", () => ({
  ...jest.requireActual("next/server"), // Keep original methods/exports
  NextResponse: {
    // Mock only the NextResponse object
    json: jest.fn((body, init) => ({
      // Mock the static .json method
      json: () => Promise.resolve(body), // Mock the instance .json() method
      status: init?.status || 200,
      headers: new Headers(init?.headers),
      ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
      // Add other Response properties if needed by your assertions
    })),
  },
}));

// No longer need createMockRequest for DELETE tests if request object isn't used
// function createMockRequest(url: string, options?: RequestInit): NextRequest {
//   const request = new NextRequest(new URL(url, 'http://localhost'), options);
//   return request;
// }

describe("DELETE /api/clients/[clientId]", () => {
  // Get a reference to the mocked auth function
  const mockedAuth = jest.requireMock("../../auth/[...nextauth]/route")
    .auth as jest.Mock;

  // Use the pre-defined mock functions
  const mockUpdate = mockPrismaClientUpdate;
  const mockFindMany = mockPrismaClientFindMany;
  const mockFindUnique = mockPrismaClientFindUnique;

  const testClientId = "client-to-delete-123";

  beforeEach(() => {
    // Reset mocks before each test
    mockedAuth.mockClear();
    mockUpdate.mockClear();
    mockFindMany.mockClear();
    mockFindUnique.mockClear();
  });

  it("should return 401 if user is not authenticated", async () => {
    // Arrange
    mockedAuth.mockResolvedValue(null);
    // Pass a minimal mock request object (cast needed)
    const mockRequest = {} as NextRequest;
    const context = { params: { clientId: testClientId } };

    // Act
    const response = await DELETE(mockRequest, context);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should return 200 and the updated client on successful soft delete", async () => {
    // Arrange
    const mockSession = { user: { id: "user-1" } }; // Simple mock session
    mockedAuth.mockResolvedValue(mockSession);

    const updatedClientData = {
      id: testClientId,
      name: "Deleted Client",
      isActive: false, // Expected state after update
      birthday: "01/01/1970",
      checkingAccountNumber: "mockCheckingAcc",
      checkingBalance: "0",
      savingsAccountNumber: null,
      savingsBalance: null,
      displayOrder: 1,
    };

    mockFindUnique.mockResolvedValue({ id: testClientId, isActive: true });
    mockUpdate.mockResolvedValue(updatedClientData);

    // Pass a minimal mock request object (cast needed)
    const mockRequest = {} as NextRequest;
    const context = { params: { clientId: testClientId } };

    // Act
    const response = await DELETE(mockRequest, context);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body.message).toBe("Client deactivated successfully");
    expect(body.client).toEqual(updatedClientData);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: testClientId },
      data: { isActive: false },
    });
  });

  // Add more tests: client not found, DB error
});
