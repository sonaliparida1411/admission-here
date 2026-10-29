import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Adding default superadmin and sample staff account...");
  const defaultPasswordHash = await bcrypt.hash("Password@123", 10);

  // 1. Super Admin
  await db.user.upsert({
    where: { email: "superadmin@admissionhere.in" },
    update: {
      passwordHash: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      name: "Super Administrator",
      email: "superadmin@admissionhere.in",
      passwordHash: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  // Also support superadmin@admissionshub.in if user had logged in before
  await db.user.upsert({
    where: { email: "superadmin@admissionshub.in" },
    update: {
      passwordHash: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
    create: {
      name: "Super Administrator",
      email: "superadmin@admissionshub.in",
      passwordHash: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  // 2. Sample Staff (Only Leads and Reviews)
  const staff = await db.user.upsert({
    where: { email: "staff_leads@admissionhere.in" },
    update: {
      passwordHash: defaultPasswordHash,
      role: UserRole.STAFF,
    },
    create: {
      name: "Vikram Mehta (Lead Counselor)",
      email: "staff_leads@admissionhere.in",
      phone: "+919876543213",
      phoneVerified: true,
      passwordHash: defaultPasswordHash,
      role: UserRole.STAFF,
    },
  });

  await db.staffPermission.upsert({
    where: { userId: staff.id },
    update: {
      permissions: ["leads", "reviews"],
    },
    create: {
      userId: staff.id,
      permissions: ["leads", "reviews"],
    },
  });

  console.log("✅ Super Admin and Staff accounts configured successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
