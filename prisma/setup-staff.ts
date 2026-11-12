import { PrismaClient, UserRole } from "@prisma/client";

const db = new PrismaClient();

// Precomputed bcrypt hash for default test password: "Password@123"
const defaultPasswordHash = "$2b$10$HfTqQGmFuZuzET64tyeNQOiP7cHqXifAuWg08vSCUKSc3wUa4cOyy";

async function main() {
  console.log("Adding default superadmin and sample staff account...");

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
