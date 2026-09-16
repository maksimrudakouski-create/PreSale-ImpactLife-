import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  className?: string;
  mainClassName?: string;
  brand?: ReactNode;
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  children: ReactNode;
};

/** A focused, navigation-free frame for identity and access states. */
export function AccessStatusFrame({
  className,
  mainClassName,
  brand,
  icon,
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <main className={cn("flex min-h-svh items-center justify-center bg-muted/30 px-4 py-10", mainClassName)}>
      <Card className={cn("w-full max-w-lg shadow-sm", className)}>
        <CardHeader className="items-center gap-4 text-center">
          {brand ? <div className="flex w-full justify-center">{brand}</div> : null}
          {icon ? (
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          ) : null}
          {eyebrow ? (
            <Badge variant="secondary" className="font-medium">
              {eyebrow}
            </Badge>
          ) : null}
          <div className="space-y-2">
            <Heading level={1}>{title}</Heading>
            <Text variant="muted" className="mx-auto max-w-sm">
              {description}
            </Text>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </main>
  );
}
