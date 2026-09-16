import { Badge } from "@/components/ui/badge";

type SessionStatus = "Incomplete" | "Active" | "Completed";

type Props = {
  status: SessionStatus;
};

export function SessionStatusBadge({ status }: Props) {
  const variant = status === "Incomplete" ? "destructive" : "secondary";
  const className =
    status === "Completed"
      ? "bg-status-completed text-status-completed-foreground"
      : status === "Active"
        ? "bg-status-active text-status-active-foreground"
        : undefined;

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
