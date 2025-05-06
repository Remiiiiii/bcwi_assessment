import { PrismaClient, ClientType } from "../app/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const clientsData = [
    {
      name: "Alice Wonderland",
      birthday: "03 / 14 / 1990",
      type: ClientType.SAVINGS,
      account: "1234567890123",
      balance: new Decimal("1500.75"),
    },
    {
      name: "Bob The Builder",
      birthday: "07 / 21 / 1985",
      type: ClientType.CHECKING,
      account: "9876543210987",
      balance: new Decimal("250.00"),
    },
    {
      name: "Charlie Brown",
      birthday: "10 / 02 / 1950",
      type: ClientType.SAVINGS,
      account: "1122334455667",
      balance: new Decimal("12345.67"),
    },
    {
      name: "Diana Prince",
      birthday: "03 / 22 / 1941",
      type: ClientType.CHECKING,
      account: "0000000000001",
      balance: new Decimal("50000.00"),
    },
    {
      name: "Edward Scissorhands",
      birthday: "10 / 25 / 1990",
      type: ClientType.SAVINGS,
      account: "2233445566778",
      balance: new Decimal("500.25"),
    },
    {
      name: "Fiona Gallagher",
      birthday: "08 / 15 / 1991",
      type: ClientType.CHECKING,
      account: "3344556677889",
      balance: new Decimal("125.99"),
    },
  ];

  // Use createMany for efficiency
  const result = await prisma.client.createMany({
    data: clientsData,
    skipDuplicates: true, // Optional: if you run the seed multiple times
  });

  console.log(`Created ${result.count} new clients.`);
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
