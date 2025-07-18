"use client";

// import { useState } from "react";
// import { Button } from "@components/ui/button";
import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { ModeToggle } from "@components/toggle-theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { AuthCredentialsForm } from "./auth-credentials-form";
// import { Separator } from "@components/ui/separator";

// function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 24 24"
//       height="24"
//       width="24"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//         fill="#4285F4"
//       />
//       <path
//         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//         fill="#34A853"
//       />
//       <path
//         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//         fill="#FBBC05"
//       />
//       <path
//         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//         fill="#EA4335"
//       />
//     </svg>
//   );
// }

const Auth = () => {
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string>("");

  // const handleGoogleSignIn = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");
  //     const result = await signIn("google", {
  //       callbackUrl: "/dashboard",
  //       redirect: false,
  //     });

  //     if (result?.error) {
  //       setError(result.error);
  //     } else if (result?.url) {
  //       router.push(result.url);
  //     }
  //   } catch (error) {
  //     setError("An error occurred during sign in");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to Board Hub</h1>
          <p className="text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-6">
            <AuthCredentialsForm />
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div> */}
            {/* <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-11 text-base flex items-center gap-3"
              disabled={loading}
            >
              <GoogleIcon className="size-5" />
              {loading ? "Loading..." : "Sign in with Google"}
            </Button> */}
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <AuthCredentialsForm isRegister />
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div> */}
            {/* <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-11 text-base flex items-center gap-3"
              disabled={loading}
            >
              <GoogleIcon className="size-5" />
              {loading ? "Loading..." : "Register with Google"}
            </Button> */}
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground/60">
          <p>
            By continuing, you agree to our{" "}
            <Link
              href="/terms-of-service"
              className="text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
