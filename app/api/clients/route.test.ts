import { GET } from "./route";
import { NextRequest } from "next/server";
// import { Session } from "next-auth"; // Session is no longer used since the authenticated test is commented out

// Define variables to hold mock references
// NO LONGER NEEDED: let mockFindMany: jest.Mock;
// NO LONGER NEEDED: let mockUpdate: jest.Mock; // Keep for consistency even if not used in GET

// Mock the @/lib/prisma module
jest.mock("@/lib/prisma", () => {
  // Create mocks *inside* the factory and return them as part of the mock structure
  return {
    __esModule: true, // Needed for ES Module default export mocking
    default: {
      // Mock the default exported instance
      client: {
        findMany: jest.fn(), // Will be retrieved later
        update: jest.fn(), // Will be retrieved later (for consistency or future tests)
        // Add other methods as needed, creating mocks inside factory
      },
    },
  };
});

// --- Mock Auth ---
jest.mock("../auth/[...nextauth]/route", () => ({
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

describe("GET /api/clients", () => {
  // Get a reference to the mocked auth function *after* jest.mock has run
  const mockedAuth = jest.requireMock("../auth/[...nextauth]/route")
    .auth as jest.Mock;

  // Get references to the mock functions from the mocked prisma module
  const prismaClientMock = jest.requireMock("@/lib/prisma").default.client;
  const mockFindMany = prismaClientMock.findMany as jest.Mock;
  const mockUpdate = prismaClientMock.update as jest.Mock; // For consistency in clearing

  beforeEach(() => {
    // Reset mocks before each test
    mockedAuth.mockClear();
    mockFindMany.mockClear(); // Reset the specific mock function
    mockUpdate.mockClear();
  });

  it("should return 401 if user is not authenticated", async () => {
    // Arrange: Mock auth() to return null
    mockedAuth.mockResolvedValue(null);
    // Pass a minimal mock request object (cast needed)
    const requestUrl = new URL("http://localhost/api/clients");
    const mockRequest = {
      url: requestUrl.toString(),
      nextUrl: { searchParams: requestUrl.searchParams },
    } as NextRequest;

    // Act: Call the handler
    const response = await GET(mockRequest);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  // Temporarily commenting out this test due to mocking issues
  it("should return 200 and a list of active clients if authenticated", async () => {
    // Arrange
    const mockSession: import("next-auth").Session = {
      // Add import type for Session
      user: { id: "user-1", email: "test@example.com" },
      expires: new Date(Date.now() + 3600 * 1000).toISOString(), // Example expiry
    };
    mockedAuth.mockResolvedValue(mockSession);

    const mockClients = [
      {
        id: "1",
        name: "Client A",
        birthday: "01/01/1990",
        isActive: true,
        displayOrder: 1,
        checkingAccountNumber: "1",
        checkingBalance: "100",
        savingsAccountNumber: null,
        savingsBalance: null,
      },
      {
        id: "2",
        name: "Client B",
        birthday: "02/02/1991",
        isActive: true,
        displayOrder: 2,
        checkingAccountNumber: "2",
        checkingBalance: "200",
        savingsAccountNumber: null,
        savingsBalance: null,
      },
    ];
    // Configure the mock function directly
    mockFindMany.mockResolvedValue(mockClients);

    // Pass a minimal mock request object (cast needed)
    const requestUrlWithParams = new URL(
      "http://localhost/api/clients?activeOnly=true"
    );
    const mockRequestWithParams = {
      url: requestUrlWithParams.toString(),
      nextUrl: { searchParams: requestUrlWithParams.searchParams },
    } as NextRequest;

    // Act
    const response = await GET(mockRequestWithParams);
    const body = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(body).toEqual(mockClients);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { AND: [{ isActive: true }] }, // Should filter by isActive: true by default
      orderBy: { displayOrder: "asc" },
    });
  });
});
