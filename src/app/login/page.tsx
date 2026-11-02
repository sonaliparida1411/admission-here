"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email address or password.");
      } else {
        // Direct students to public portal/colleges instead of admin
        const target =
          email.toLowerCase().includes("student") && callbackUrl === "/admin"
            ? "/colleges"
            : callbackUrl;
        router.push(target);
      }
    } catch (err) {
      setError("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  const setTestAccount = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("Password@123");
  };

  return (
    <div className="w-full max-w-md bg-card border rounded-2xl p-4 sm:p-8 shadow-xl space-y-5 sm:space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Admission Here"
            width={160}
            height={44}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Sign In to Your Account</h1>
        <p className="text-xs text-muted-foreground">
          Access RBAC Admin CMS, Counselor Lead CRM, or Student Applications.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@admissionshub.in"
              className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Quick Test Accounts for Demonstration */}
      <div className="border-t pt-4 space-y-2.5">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Quick 1-Click RBAC Test Logins:
        </p>

        <div className="grid grid-cols-1 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              setTestAccount("superadmin@admissionhere.in");
            }}
            className="p-2.5 rounded-lg border bg-muted/40 hover:bg-accent text-left flex items-center justify-between group transition-colors"
          >
            <div>
              <strong className="block text-foreground group-hover:text-primary">
                Super Admin
              </strong>
              <span className="text-[11px] text-muted-foreground">
                superadmin@admissionhere.in
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ background: "#1a3068" }}>
              FULL ADMIN ACCESS
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTestAccount("staff_leads@admissionhere.in");
            }}
            className="p-2.5 rounded-lg border bg-muted/40 hover:bg-accent text-left flex items-center justify-between group transition-colors"
          >
            <div>
              <strong className="block text-foreground group-hover:text-primary">
                Staff (Lead Counselor)
              </strong>
              <span className="text-[11px] text-muted-foreground">
                staff_leads@admissionhere.in
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ background: "#c41e1e" }}>
              RESTRICTED STAFF
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTestAccount("student@example.com");
            }}
            className="p-2.5 rounded-lg border bg-muted/40 hover:bg-accent text-left flex items-center justify-between group transition-colors"
          >
            <div>
              <strong className="block text-foreground group-hover:text-primary">
                Student Aspirant
              </strong>
              <span className="text-[11px] text-muted-foreground">student@example.com</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ background: "#1f8040" }}>
              STUDENT
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Suspense fallback={<div className="text-xs text-muted-foreground">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
