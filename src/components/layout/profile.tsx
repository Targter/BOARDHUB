import { auth, signOut } from "src/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { name, email, image } = session.user;
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleSignOut = async () => {
    "use server";
    await signOut({
      redirectTo: "/",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-[35px] h-[35px] cursor-pointer items-center rounded-full select-none overflow-hidden justify-center hover:opacity-80 transition-opacity">
          {image ? (
            <Image
              src={image}
              alt={name || "User"}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-xs font-medium">
              {initials}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form action={handleSignOut}>
          <Button
            variant={"outline"}
            className="cursor-pointer !p-0 text-left w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
