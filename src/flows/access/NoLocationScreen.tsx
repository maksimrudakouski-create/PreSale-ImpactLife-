import { Link } from "@tanstack/react-router";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessStatusFrame } from "@/shared/ui/AccessStatusFrame";
import { Text } from "@/shared/ui/typography";

type LocationAccessDetails = {
  supportEmail: string;
};

const mockLocationAccessDetails: LocationAccessDetails = {
  supportEmail: "identity-support@impactlife.org",
};

type Props = {
  details?: LocationAccessDetails;
};

export default function NoLocationScreen({ details = mockLocationAccessDetails }: Props) {
  return (
    <AccessStatusFrame
      icon={<MapPinOff className="size-7" aria-hidden="true" />}
      eyebrow="Location access required"
      title="No authorized location was found"
      description="You signed in successfully, but your profile does not have a valid physical location assignment for this application."
    >
      <Button className="w-full" asChild>
        <a href={`mailto:${details.supportEmail}`}>Contact your administrator</a>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link to="/">Return to sign in</Link>
      </Button>
      <Text variant="small" className="text-center">
        Application navigation stays unavailable until an administrator assigns a location.
      </Text>
    </AccessStatusFrame>
  );
}
