import { Link, useParams } from "@tanstack/react-router";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { demoAccessProfile, type AccessProfile } from "../_mocks/access";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  profile?: AccessProfile;
};

export default function ScanningWorkspaceScreen({ profile = demoAccessProfile }: Props) {
  const { locationId } = useParams({ strict: false });
  const sessionLocation =
    profile.locations.find((location) => location.id === locationId) ?? profile.locations[0];

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={profile.user} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-7 space-y-2">
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Scanning access granted
          </Badge>
          <Heading level={1}>Scanning workspace</Heading>
          <Text variant="lead">
            Your session is ready with an authorized identity and location context.
          </Text>
        </div>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <Heading level={3}>Session context</Heading>
              <Text variant="muted">
                The scanning module will use this location when it is connected during integration.
              </Text>
            </div>
          </CardHeader>
          <CardContent className="rounded-lg border bg-background p-4">
            <Text as="div" className="font-medium">
              {sessionLocation?.name ?? "Location pending"}
            </Text>
            <Text variant="small">
              {sessionLocation ? `${sessionLocation.code} · ${sessionLocation.detail}` : "No location selected"}
            </Text>
          </CardContent>
          <CardFooter className="justify-end gap-3">
            <Button variant="outline" asChild>
              <Link to="/location">Change location</Link>
            </Button>
            <Button asChild>
              <Link to="/suite">
                Return to suite portal
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
