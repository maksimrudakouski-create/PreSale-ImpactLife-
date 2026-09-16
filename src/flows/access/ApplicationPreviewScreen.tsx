import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { demoAccessProfile, type AccessProfile } from "../_mocks/access";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  profile?: AccessProfile;
};

export default function ApplicationPreviewScreen({ profile = demoAccessProfile }: Props) {
  const { applicationId } = useParams({ strict: false });
  const application =
    profile.applications.find((item) => item.id === applicationId) ?? profile.applications[0];

  if (!application) {
    return null;
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={profile.user} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Button variant="ghost" size="sm" asChild className="mb-5">
          <Link to="/suite">
            <ArrowLeft aria-hidden="true" />
            Your applications
          </Link>
        </Button>
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FlaskConical aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="gap-1.5">
                <ShieldCheck aria-hidden="true" />
                Test application
              </Badge>
              <Heading level={1}>{application.name}</Heading>
              <Text variant="lead">{application.description}</Text>
            </div>
          </CardHeader>
          <CardContent>
            <Text>
              This test module is a navigable preview. Its live data and workflows are connected during
              the integration phase.
            </Text>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild>
              <Link to="/suite">Return to suite portal</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
