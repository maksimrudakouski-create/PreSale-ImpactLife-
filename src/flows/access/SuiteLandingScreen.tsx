import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, MapPinned, ShieldCheck, Tags, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { demoAccessProfile, type AccessProfile } from "../_mocks/access";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  profile?: AccessProfile;
};

const applicationIcons: Record<string, LucideIcon> = {
  "ready-to-label": Tags,
  "quality-review": ClipboardCheck,
  "collection-operations": MapPinned,
};

export default function SuiteLandingScreen({ profile = demoAccessProfile }: Props) {
  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={profile.user} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 space-y-2">
          <div className="space-y-2">
            <Badge variant="secondary" className="gap-1.5">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Identity verified
            </Badge>
            <Heading level={1}>Welcome back, {profile.user.name.split(" ")[0]}</Heading>
            <Text variant="lead" className="max-w-2xl">
              Open an application you&rsquo;re authorized to access. Your permissions are managed by
              your corporate security groups. Only authorized applications are shown.
            </Text>
          </div>
        </div>

        <section aria-label="Authorized applications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {profile.applications.map((application) => {
              const ApplicationIcon = applicationIcons[application.id] ?? ShieldCheck;

              return (
                <Card key={application.id} className="min-h-52 justify-between">
                  <CardHeader className="space-y-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ApplicationIcon className="size-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <Heading level={3} as="h2">
                        {application.name}
                      </Heading>
                      <Text variant="muted">{application.description}</Text>
                    </div>
                  </CardHeader>
                  <CardFooter className="justify-between gap-3">
                    <Badge variant="outline">Authorized</Badge>
                    {application.id === "ready-to-label" ? (
                      <Button size="sm" asChild>
                        <Link to="/ready-to-label">
                          {application.actionLabel}
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" asChild>
                        <Link to="/applications/$applicationId" params={{ applicationId: application.id }}>
                          {application.actionLabel}
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
