import { auth } from "src/auth";
import { redirect } from "next/navigation";
import Auth from "./auth";

export default async function AuthCheck() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <Auth />;
}
