import { auth } from "@/lib/auth/config";

export interface AdminAccessResult {
  allowed: boolean;
  isSuperAdmin: boolean;
  role: string;
  userName: string;
  userEmail: string;
  permissions: string[];
}

/**
 * Checks if the current session has permission to access an admin feature.
 * If user is SUPER_ADMIN, always returns allowed: true.
 * If user is STAFF, checks if feature is in permissions.
 * If user is not logged in (e.g. development), allows default to SUPER_ADMIN.
 */
export async function checkAdminAccess(feature?: string): Promise<AdminAccessResult> {
  const session = await auth();
  const user = session?.user as any;

  if (!user) {
    // If running in development without active session, default to super admin
    return {
      allowed: true,
      isSuperAdmin: true,
      role: "SUPER_ADMIN",
      userName: "Super Administrator",
      userEmail: "superadmin@admissionhere.in",
      permissions: [
        "dashboard",
        "colleges",
        "exams",
        "blogs",
        "reviews",
        "leads",
        "seo-geo",
        "users",
        "staff",
      ],
    };
  }

  const role = user.role || "STUDENT";
  const permissions: string[] = user.permissions || [];
  const userName = user.name || "User";
  const userEmail = user.email || "";

  if (role === "SUPER_ADMIN") {
    return {
      allowed: true,
      isSuperAdmin: true,
      role: "SUPER_ADMIN",
      userName,
      userEmail,
      permissions: [
        "dashboard",
        "colleges",
        "exams",
        "blogs",
        "reviews",
        "leads",
        "seo-geo",
        "users",
        "staff",
      ],
    };
  }

  if (role === "STAFF") {
    // Staff can never access Staff Management or User Role management
    if (!feature || feature === "staff" || feature === "users" || feature === "all") {
      return {
        allowed: false,
        isSuperAdmin: false,
        role: "STAFF",
        userName,
        userEmail,
        permissions,
      };
    }

    // Dashboard is always allowed if they are staff
    if (feature === "dashboard") {
      return {
        allowed: true,
        isSuperAdmin: false,
        role: "STAFF",
        userName,
        userEmail,
        permissions,
      };
    }

    // Check specific module
    const allowed = permissions.includes(feature);
    return {
      allowed,
      isSuperAdmin: false,
      role: "STAFF",
      userName,
      userEmail,
      permissions,
    };
  }

  return {
    allowed: false,
    isSuperAdmin: false,
    role,
    userName,
    userEmail,
    permissions: [],
  };
}

