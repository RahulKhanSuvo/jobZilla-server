import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { envConfig } from "../src/config/env";

async function main() {
  const adminEmail = envConfig.ADMIN_EMAIL;
  const adminPassword = envConfig.ADMIN_PASSWORD;

  console.log("Seeding super admin...");

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log(`Admin with email ${adminEmail} already exists. Skipping.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Super admin created successfully!`);
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${adminPassword} (Please change this after first login)`);
}

main()
  .catch((e) => {
    console.error("Error seeding super admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    // If the prisma client was initialized in the script we would disconnect here.
    // Since it's imported, we can still call disconnect on it.
  });
