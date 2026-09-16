import { Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessStatusFrame } from "@/shared/ui/AccessStatusFrame";
import { Text } from "@/shared/ui/typography";

type DenialDetails = {
  supportEmail: string;
};

const mockDenialDetails: DenialDetails = {
  supportEmail: "identity-support@impactlife.org",
};

type Props = {
  details?: DenialDetails;
};

export default function AccessDeniedScreen({ details = mockDenialDetails }: Props) {
  return (
    <AccessStatusFrame
      icon={<ShieldX className="size-7" aria-hidden="true" />}
      eyebrow="Access denied"
      title="You don&rsquo;t have access to an application"
      description="Your identity was verified, but it is not assigned to a security group that grants access to this application."
    >
      <Button className="w-full" asChild>
        <a href={`mailto:${details.supportEmail}`}>Contact your administrator</a>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link to="/">Return to sign in</Link>
      </Button>
      <Text variant="small" className="text-center">
        For security, application navigation is unavailable from this screen.
      </Text>
    </AccessStatusFrame>
  );
}
