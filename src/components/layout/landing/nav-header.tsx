import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { ModeToggle } from "@components/toggle-theme";

export function NavHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16">
          <div className="flex h-full items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Board Hub
              </h2>
            </Link>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </nav>

              <div className="flex items-center gap-4">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
