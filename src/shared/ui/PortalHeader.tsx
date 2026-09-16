import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/shared/ui/typography";

type Props = {
  user: {
    name: string;
    email: string;
    role: string;
  };
};

/** Global navigation for authenticated suite screens. */
export function PortalHeader({ user }: Props) {
  const initials = user.name
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-(--devbar-height) z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center">
          <Link
            to="/suite"
            aria-label="ImpactLife suite portal"
            className="shrink-0 rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <img src="/impactlife-logo.svg" alt="" className="h-10 w-auto dark:hidden" />
            <img src="/impactlife-logo-dark.svg" alt="" className="hidden h-10 w-auto dark:block" />
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 border-r pr-3 sm:flex">
            <div className="text-right">
              <Text as="div" className="max-w-44 truncate text-xs font-medium">
                {user.name}
              </Text>
              <Text variant="small" as="div" className="max-w-44 truncate">
                {user.role}
              </Text>
            </div>
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/signed-out">
              <LogOut aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
