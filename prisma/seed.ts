import { PrismaClient, ClientType } from "../app/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const clientsData = [
    {
      name: "Alicia Marie Carter",
      birthday: "09 / 15 / 1993",
      type: ClientType.SAVINGS,
      account: "0596779403556",
      balance: new Decimal("9876.54"),
    },
    {
      name: "David Nguyen",
      birthday: "04 / 22 / 1987",
      type: ClientType.CHECKING,
      account: "1234567890123",
      balance: new Decimal("8901.23"),
    },
    {
      name: "Samantha Lee Thompson",
      birthday: "12 / 07 / 1975",
      type: ClientType.SAVINGS,
      account: "9876543210987",
      balance: new Decimal("7890.12"),
    },
    {
      name: "Marcus Jordan Pierce",
      birthday: "06 / 30 / 1990",
      type: ClientType.CHECKING,
      account: "1029384756102",
      balance: new Decimal("7654.32"),
    },
    {
      name: "Isabella Ramirez",
      birthday: "11 / 10 / 2002",
      type: ClientType.CHECKING,
      account: "5647382910564",
      balance: new Decimal("6543.21"),
    },
    {
      name: "Ethan James Holloway",
      birthday: "02 / 05 / 1981",
      type: ClientType.SAVINGS,
      account: "1928374655192",
      balance: new Decimal("5432.10"),
    },
    {
      name: "Chloe Bennett",
      birthday: "07 / 18 / 1999",
      type: ClientType.CHECKING,
      account: "3748291056374",
      balance: new Decimal("4567.89"),
    },
    {
      name: "Michael Alan Rivera",
      birthday: "01 / 23 / 1985",
      type: ClientType.SAVINGS,
      account: "8473625142847",
      balance: new Decimal("3210.98"),
    },
    {
      name: "Natalie Ortiz",
      birthday: "05 / 03 / 1978",
      type: ClientType.CHECKING,
      account: "2938475610293",
      balance: new Decimal("2678.90"),
    },
    {
      name: "Jason Christopher Blake",
      birthday: "10 / 12 / 2000",
      type: ClientType.SAVINGS,
      account: "9182736450918",
      balance: new Decimal("2345.67"),
    },
    {
      name: "Emily Grace Kim",
      birthday: "03 / 29 / 1989",
      type: ClientType.CHECKING,
      account: "7362810495736",
      balance: new Decimal("1987.65"),
    },
    {
      name: "Liam Patterson",
      birthday: "08 / 27 / 1995",
      type: ClientType.SAVINGS,
      account: "1827364509182",
      balance: new Decimal("1234.56"),
    },
    {
      name: "Olivia Danielle Ross",
      birthday: "12 / 19 / 1982",
      type: ClientType.CHECKING,
      account: "3647382910594",
      balance: new Decimal("140.31"),
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
