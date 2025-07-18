"use client";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@components/ui/password-input";

interface AuthCredentialsFormProps {
  isRegister?: boolean;
}

export function AuthCredentialsForm({ isRegister }: AuthCredentialsFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = (formData.get("email") as string).toLowerCase().trim();
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;

      // Validate inputs
      if (!email || !password || (isRegister && !name)) {
        throw new Error("Please fill in all fields");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (isRegister) {
        // Register
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.error === "User already exists") {
            throw new Error(
              "An account with this email already exists. Please sign in instead."
            );
          }
          throw new Error(data.error || "Registration failed");
        }
      }

      // Handle sign in (both after registration and direct login)
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes("No user found")) {
          if (isRegister) {
            throw new Error(
              "Registration successful but login failed. Please try logging in."
            );
          } else {
            throw new Error(
              "No account found with this email. Please register first or check your email address."
            );
          }
        } else if (result.error.includes("Google sign in")) {
          throw new Error(
            "This email was registered with Google. Please use the 'Sign in with Google' button below."
          );
        } else if (result.error.includes("Invalid password")) {
          throw new Error(
            "Incorrect password. Please try again or use 'Sign in with Google' if you registered with Google."
          );
        } else {
          throw new Error(result.error);
        }
      }

      // If we get here, sign in was successful
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Auth error:", err);
      if (isRegister) {
        setError("User already exists with the same email.");
      } else {
        setError("Register first or credential wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {isRegister && (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required={isRegister}
            disabled={loading}
            minLength={2}
            maxLength={50}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
          disabled={loading}
          defaultValue={"twoo@gmail.com"}
          autoComplete={isRegister ? "off" : "email"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          required
          disabled={loading}
          placeholder="••••••••"
          minLength={6}
          defaultValue={"two@gmail.com"}
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
        {isRegister && (
          <p className="text-xs text-muted-foreground mt-1">
            Password must be at least 6 characters long
          </p>
        )}
      </div>
      {error && (
        <div className="p-3 text-sm bg-red-100 dark:bg-red-950 rounded-md flex flex-col gap-1">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : isRegister ? "Register" : "Sign In"}
      </Button>
    </form>
  );
}
