import { PrismaClient, Prisma } from "../generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// Helper function to parse date strings.
// IMPORTANT: Determine if your strings are DD/MM/YYYY or MM/DD/YYYY and adjust parsing.
// This example assumes MM/DD/YYYY as per "09/15/1993" in your data.
// If it's truly DD/MM/YYYY, swap month and day in `new Date(Date.UTC(year, month - 1, day))`.
function parseDateString(dateString: string): Date | null {
  if (!dateString) return null;
  const parts = dateString.split("/");
  if (parts.length === 3) {
    // Assuming MM/DD/YYYY based on "09/15/1993"
    const month = parseInt(parts[0], 10); // Month (1-12)
    const day = parseInt(parts[1], 10); // Day
    const year = parseInt(parts[2], 10); // Year

    // Validate parts
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      console.warn(`Invalid date parts in string: ${dateString}`);
      return null;
    }
    // Basic validation (can be more thorough)
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      console.warn(`Date parts out of range in string: ${dateString}`);
      return null;
    }
    // JavaScript Date constructor month is 0-indexed (0 for January, 11 for December)
    return new Date(Date.UTC(year, month - 1, day));
  }
  console.warn(
    `Could not parse date string (expected MM/DD/YYYY): ${dateString}`
  );
  return null;
}

async function main() {
  console.log(`Start seeding ...`);

  console.log(`Deleting existing clients...`);
  await prisma.client.deleteMany({});
  console.log(`Existing clients deleted.`);

  const clientsRawData = [
    {
      name: "Alicia Marie Carter",
      birthdayString: "09/15/1993",
      checkingAccountNumber: "C0596779403556",
      checkingBalance: new Decimal("5876.54"),
      savingsAccountNumber: "S0596779403556",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 1,
    },
    {
      name: "David Nguyen",
      birthdayString: "04/22/1987",
      checkingAccountNumber: "C1234567890123",
      checkingBalance: new Decimal("4901.23"),
      savingsAccountNumber: "S1234567890123",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 2,
    },
    {
      name: "Samantha Lee Thompson",
      birthdayString: "12/07/1975",
      checkingAccountNumber: "C9876543210987",
      checkingBalance: new Decimal("3890.12"),
      savingsAccountNumber: "S9876543210987",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 3,
    },
    {
      name: "Marcus Jordan Pierce",
      birthdayString: "06/30/1990",
      checkingAccountNumber: "C1029384756102",
      checkingBalance: new Decimal("3654.32"),
      savingsAccountNumber: "S1029384756102",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 4,
    },
    {
      name: "Isabella Ramirez",
      birthdayString: "11/10/2002",
      checkingAccountNumber: "C5647382910564",
      checkingBalance: new Decimal("2543.21"),
      savingsAccountNumber: "S5647382910564",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 5,
    },
    {
      name: "Ethan James Holloway",
      birthdayString: "02/05/1981",
      checkingAccountNumber: "C1928374655192",
      checkingBalance: new Decimal("1432.10"),
      savingsAccountNumber: "S1928374655192",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 6,
    },
    {
      name: "Chloe Bennett",
      birthdayString: "07/18/1999",
      checkingAccountNumber: "C3748291056374",
      checkingBalance: new Decimal("2567.89"),
      savingsAccountNumber: "S3748291056374",
      savingsBalance: new Decimal("2000.00"),
      displayOrder: 7,
    },
    {
      name: "Michael Alan Rivera",
      birthdayString: "01/23/1985",
      checkingAccountNumber: "C8473625142847",
      checkingBalance: new Decimal("1210.98"),
      savingsAccountNumber: "S8473625142847",
      savingsBalance: new Decimal("2000.00"),
      displayOrder: 8,
    },
    {
      name: "Natalie Ortiz",
      birthdayString: "05/03/1978",
      checkingAccountNumber: "C2938475610293",
      checkingBalance: new Decimal("1678.90"),
      savingsAccountNumber: "S2938475610293",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 9,
    },
    {
      name: "Jason Christopher Blake",
      birthdayString: "10/12/2000",
      checkingAccountNumber: "C9182736450918",
      checkingBalance: new Decimal("1345.67"),
      savingsAccountNumber: "S9182736450918",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 10,
    },
    {
      name: "Emily Grace Kim",
      birthdayString: "03/29/1989",
      checkingAccountNumber: "C7362810495736",
      checkingBalance: new Decimal("987.65"),
      savingsAccountNumber: "S7362810495736",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 11,
    },
    {
      name: "Liam Patterson",
      birthdayString: "08/27/1995",
      checkingAccountNumber: "L1827364509182",
      checkingBalance: new Decimal("234.56"),
      savingsAccountNumber: "S1827364509182",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 12,
    },
    {
      name: "Olivia Danielle Ross",
      birthdayString: "12/19/1982",
      checkingAccountNumber: "C3647382910594",
      checkingBalance: new Decimal("140.31"),
      savingsAccountNumber: "S3647382910594",
      savingsBalance: new Decimal("0.00"),
      displayOrder: 13,
    },
  ];

  const clientsDataForDb = clientsRawData
    .map((client) => {
      const { birthdayString, ...restOfClient } = client;
      const birthdayDate = parseDateString(birthdayString);

      if (!birthdayDate) {
        console.warn(
          `Skipping client due to unparseable birthday: ${client.name} - ${birthdayString}`
        );
        return null;
      }

      return {
        ...restOfClient,
        birthday: birthdayDate,
      };
    })
    .filter((client) => client !== null);

  try {
    const result = await prisma.client.createMany({
      data: clientsDataForDb as Prisma.ClientCreateManyInput[],
      skipDuplicates: true,
    });
    console.log(`Created ${result.count} new clients.`);
  } catch (e: unknown) {
    console.error("Error during prisma.client.createMany():", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma Error Code:", e.code);
      console.error("Meta details:", e.meta);
    } else if (e instanceof Error) {
      console.error("Non-Prisma error message:", e.message);
    } else {
      console.error("Unknown error structure:", e);
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error("Unhandled error in main seeding function:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
