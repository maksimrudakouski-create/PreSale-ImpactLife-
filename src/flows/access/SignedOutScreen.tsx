import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AccessStatusFrame } from "@/shared/ui/AccessStatusFrame";
import { AccessScreenBackground } from "@/shared/ui/AccessScreenBackground";
import { ImpactLifeBrand } from "@/shared/ui/ImpactLifeBrand";
import { Text } from "@/shared/ui/typography";

type SignedOutSession = {
  identityProvider: string;
};

const mockSignedOutSession: SignedOutSession = {
  identityProvider: "Microsoft Entra ID",
};

type Props = {
  session?: SignedOutSession;
};

export default function SignedOutScreen({ session = mockSignedOutSession }: Props) {
  return (
    <AccessScreenBackground>
      <AccessStatusFrame
        mainClassName="relative z-10 min-h-svh bg-transparent"
        className="max-w-sm -translate-y-[10svh]"
        brand={<ImpactLifeBrand />}
        title="Your session has ended"
        description={`You have signed out of the ImpactLife suite. The next user can sign in with ${session.identityProvider}.`}
      >
        <Button className="w-full" asChild>
          <Link to="/">Return to sign in</Link>
        </Button>
        <Text variant="small" className="text-center">
          The live sign-out flow will clear the local session and complete single sign-out during
          integration.
        </Text>
      </AccessStatusFrame>
    </AccessScreenBackground>
  );
}
