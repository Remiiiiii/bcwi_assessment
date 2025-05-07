import { PrismaClient } from "../app/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Delete all existing clients
  console.log(`Deleting existing clients...`);
  await prisma.client.deleteMany({});
  console.log(`Existing clients deleted.`);

  const clientsData = [
    {
      name: "Alicia Marie Carter",
      birthday: "09/15/1993",
      checkingAccountNumber: "C0596779403556",
      checkingBalance: new Decimal("5876.54"),
      savingsAccountNumber: "S0596779403556",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 1,
    },
    {
      name: "David Nguyen",
      birthday: "04/22/1987",
      checkingAccountNumber: "C1234567890123",
      checkingBalance: new Decimal("4901.23"),
      savingsAccountNumber: "S1234567890123",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 2,
    },
    {
      name: "Samantha Lee Thompson",
      birthday: "12/07/1975",
      checkingAccountNumber: "C9876543210987",
      checkingBalance: new Decimal("3890.12"),
      savingsAccountNumber: "S9876543210987",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 3,
    },
    {
      name: "Marcus Jordan Pierce",
      birthday: "06/30/1990",
      checkingAccountNumber: "C1029384756102",
      checkingBalance: new Decimal("3654.32"),
      savingsAccountNumber: "S1029384756102",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 4,
    },
    {
      name: "Isabella Ramirez",
      birthday: "11/10/2002",
      checkingAccountNumber: "C5647382910564",
      checkingBalance: new Decimal("2543.21"),
      savingsAccountNumber: "S5647382910564",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 5,
    },
    {
      name: "Ethan James Holloway",
      birthday: "02/05/1981",
      checkingAccountNumber: "C1928374655192",
      checkingBalance: new Decimal("1432.10"),
      savingsAccountNumber: "S1928374655192",
      savingsBalance: new Decimal("4000.00"),
      displayOrder: 6,
    },
    {
      name: "Chloe Bennett",
      birthday: "07/18/1999",
      checkingAccountNumber: "C3748291056374",
      checkingBalance: new Decimal("2567.89"),
      savingsAccountNumber: "S3748291056374",
      savingsBalance: new Decimal("2000.00"),
      displayOrder: 7,
    },
    {
      name: "Michael Alan Rivera",
      birthday: "01/23/1985",
      checkingAccountNumber: "C8473625142847",
      checkingBalance: new Decimal("1210.98"),
      savingsAccountNumber: "S8473625142847",
      savingsBalance: new Decimal("2000.00"),
      displayOrder: 8,
    },
    {
      name: "Natalie Ortiz",
      birthday: "05/03/1978",
      checkingAccountNumber: "C2938475610293",
      checkingBalance: new Decimal("1678.90"),
      savingsAccountNumber: "S2938475610293",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 9,
    },
    {
      name: "Jason Christopher Blake",
      birthday: "10/12/2000",
      checkingAccountNumber: "C9182736450918",
      checkingBalance: new Decimal("1345.67"),
      savingsAccountNumber: "S9182736450918",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 10,
    },
    {
      name: "Emily Grace Kim",
      birthday: "03/29/1989",
      checkingAccountNumber: "C7362810495736",
      checkingBalance: new Decimal("987.65"),
      savingsAccountNumber: "S7362810495736",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 11,
    },
    {
      name: "Liam Patterson",
      birthday: "08/27/1995",
      checkingAccountNumber: "L1827364509182",
      checkingBalance: new Decimal("234.56"),
      savingsAccountNumber: "S1827364509182",
      savingsBalance: new Decimal("1000.00"),
      displayOrder: 12,
    },
    {
      name: "Olivia Danielle Ross",
      birthday: "12/19/1982",
      checkingAccountNumber: "C3647382910594",
      checkingBalance: new Decimal("140.31"),
      savingsAccountNumber: "S3647382910594",
      savingsBalance: new Decimal("0.00"),
      displayOrder: 13,
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
