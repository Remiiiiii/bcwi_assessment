import { PrismaClient, Prisma } from "@prisma/client";
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
      // checkingAccountNumber: "0596779403555",
      // checkingBalance: new Decimal("5876.54"),
      savingsAccountNumber: "0596779403556",
      savingsBalance: new Decimal("9876.54"),
      displayOrder: 1,
    },
    {
      name: "David Nguyen",
      birthdayString: "04/22/1987",
      checkingAccountNumber: "1234567890123",
      checkingBalance: new Decimal("8901.23"),
      // savingsAccountNumber: "1234567890124",
      // savingsBalance: new Decimal("4000.00"),
      displayOrder: 2,
    },
    {
      name: "Samantha Lee Thompson",
      birthdayString: "12/07/1975",
      // checkingAccountNumber: "9876543210988",
      // checkingBalance: new Decimal("3890.12"),
      savingsAccountNumber: "9876543210987",
      savingsBalance: new Decimal("7890.12"),
      displayOrder: 3,
    },
    {
      name: "Marcus Jordan Pierce",
      birthdayString: "06/30/1990",
      checkingAccountNumber: "1029384756102",
      checkingBalance: new Decimal("7654.32"),
      // savingsAccountNumber: "1029384756100",
      // savingsBalance: new Decimal("4000.00"),
      displayOrder: 4,
    },
    {
      name: "Isabella Ramirez",
      birthdayString: "11/10/2002",
      checkingAccountNumber: "5647382910564",
      checkingBalance: new Decimal("6543.21"),
      // savingsAccountNumber: "5647382910566",
      // savingsBalance: new Decimal("4000.00"),
      displayOrder: 5,
    },
    {
      name: "Ethan James Holloway",
      birthdayString: "02/05/1981",
      // checkingAccountNumber: "1928374655199",
      // checkingBalance: new Decimal("4000.00"),
      savingsAccountNumber: "1928374655192",
      savingsBalance: new Decimal("5432.10"),
      displayOrder: 6,
    },
    {
      name: "Chloe Bennett",
      birthdayString: "07/18/1999",
      checkingAccountNumber: "3748291056374",
      checkingBalance: new Decimal("4567.89"),
      // savingsAccountNumber: "3748291056377",
      // savingsBalance: new Decimal("2000.00"),
      displayOrder: 7,
    },
    {
      name: "Michael Alan Rivera",
      birthdayString: "01/23/1985",
      // checkingAccountNumber: "8473625142844",
      // checkingBalance: new Decimal("2000.00"),
      savingsAccountNumber: "8473625142847",
      savingsBalance: new Decimal("3210.98"),
      displayOrder: 8,
    },
    {
      name: "Natalie Ortiz",
      birthdayString: "05/03/1978",
      checkingAccountNumber: "2938475610293",
      checkingBalance: new Decimal("2678.90"),
      // savingsAccountNumber: "2938475610299",
      // savingsBalance: new Decimal("1000.00"),
      displayOrder: 9,
    },
    {
      name: "Jason Christopher Blake",
      birthdayString: "10/12/2000",
      // checkingAccountNumber: "9182736450911",
      // checkingBalance: new Decimal("1000.00"),
      savingsAccountNumber: "9182736450918",
      savingsBalance: new Decimal("2345.67"),
      displayOrder: 10,
    },
    {
      name: "Emily Grace Kim",
      birthdayString: "03/29/1989",
      checkingAccountNumber: "7362810495736",
      checkingBalance: new Decimal("1987.65"),
      // savingsAccountNumber: "7362810495733",
      // savingsBalance: new Decimal("1000.00"),
      displayOrder: 11,
    },
    {
      name: "Liam Patterson",
      birthdayString: "08/27/1995",
      // checkingAccountNumber: "1827364509188",
      // checkingBalance: new Decimal("1000.00"),
      savingsAccountNumber: "1827364509182",
      savingsBalance: new Decimal("1234.56"),
      displayOrder: 12,
    },
    {
      name: "Olivia Danielle Ross",
      birthdayString: "12/19/1982",
      checkingAccountNumber: "5647382910594",
      checkingBalance: new Decimal("140.31"),
      // savingsAccountNumber: "3647382910599",
      // savingsBalance: new Decimal("0.00"),
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
