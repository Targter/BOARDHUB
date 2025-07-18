import Profile from "@components/layout/profile";
import { ModeToggle } from "@components/toggle-theme";
import { Button } from "src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Link href="/dashboard" className=" font-bold">Board Hub</Link>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Profile />
          </div>
        </div>
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
};

export default Layout;
