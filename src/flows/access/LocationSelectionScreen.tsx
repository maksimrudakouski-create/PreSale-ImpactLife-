import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoAccessProfile, type AccessProfile } from "../_mocks/access";
import { AccessStatusFrame } from "@/shared/ui/AccessStatusFrame";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  profile?: AccessProfile;
};

export default function LocationSelectionScreen({ profile = demoAccessProfile }: Props) {
  const navigate = useNavigate();
  const [locationId, setLocationId] = useState(profile.locations[0]?.id ?? "");
  const selectedLocation = profile.locations.find((location) => location.id === locationId);
  const hasSingleLocation = profile.locations.length === 1;

  if (profile.locations.length === 0) {
    return (
      <AccessStatusFrame
        icon={<MapPin className="size-7" aria-hidden="true" />}
        eyebrow="Location required"
        title="No location is assigned"
        description="Your corporate identity is verified, but it is not assigned to an authorized physical location."
      >
        <Button className="w-full" asChild>
          <Link to="/location-unavailable">View access support</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/suite">Return to suite portal</Link>
        </Button>
      </AccessStatusFrame>
    );
  }

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={profile.user} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-7 space-y-2">
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Authorized location
          </Badge>
          <Heading level={1}>{hasSingleLocation ? "Location confirmed" : "Choose your location"}</Heading>
          <Text variant="lead" className="max-w-2xl">
            {hasSingleLocation
              ? "Your profile has one approved location, so it has been selected automatically."
              : "Choose the physical location for this session. Subsequent work is associated with the location you select."}
          </Text>
        </div>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <Heading level={3}>Session location</Heading>
              <Text variant="muted">
                This context is displayed throughout the scanning workspace.
              </Text>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <Alert>
              <MapPin aria-hidden="true" />
              <AlertTitle>
                {hasSingleLocation ? "Assigned automatically" : "Selection required before scanning"}
              </AlertTitle>
              <AlertDescription>
                {hasSingleLocation
                  ? "You have one approved site for this role."
                  : "You have access to multiple sites. Confirm the site where you are working now."}
              </AlertDescription>
            </Alert>

            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                navigate({
                  to: "/scanning/$locationId",
                  params: { locationId },
                });
              }}
            >
              {hasSingleLocation ? (
                <div className="rounded-lg border bg-background p-4">
                  <Text as="div" className="font-medium">
                    {selectedLocation?.name}
                  </Text>
                  <Text variant="small">
                    {selectedLocation?.code} · {selectedLocation?.detail}
                  </Text>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="session-location" className="font-medium">
                    Physical location
                  </Label>
                  <Select value={locationId} onValueChange={setLocationId}>
                    <SelectTrigger id="session-location" className="w-full">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {profile.locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name} · {location.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedLocation ? (
                    <Text variant="small">{selectedLocation.detail}</Text>
                  ) : null}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" asChild>
                  <Link to="/suite">Cancel</Link>
                </Button>
                <Button type="submit" disabled={!selectedLocation}>
                  Continue to scanning workspace
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Text variant="small">
              If the available locations are incorrect, contact your administrator before starting a
              session.
            </Text>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
