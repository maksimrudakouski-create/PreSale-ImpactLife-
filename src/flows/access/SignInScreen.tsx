import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessStatusFrame } from "@/shared/ui/AccessStatusFrame";
import { AccessScreenBackground } from "@/shared/ui/AccessScreenBackground";
import { ImpactLifeBrand } from "@/shared/ui/ImpactLifeBrand";
import { Text } from "@/shared/ui/typography";

type SignInSession = {
  identityProvider: string;
  supportEmail: string;
};

const mockSignInSession: SignInSession = {
  identityProvider: "Microsoft Entra ID",
  supportEmail: "identity-support@impactlife.org",
};

type Props = {
  session?: SignInSession;
};

export default function SignInScreen({ session = mockSignInSession }: Props) {
  return (
    <AccessScreenBackground>
      <AccessStatusFrame
        mainClassName="relative z-10 min-h-svh bg-transparent"
        className="max-w-sm -translate-y-[10svh]"
        brand={<ImpactLifeBrand />}
        title="Sign in securely"
        description={`Use your corporate ${session.identityProvider} account to continue to the applications you are authorized to use.`}
      >
        <Button size="lg" className="w-full" asChild>
          <Link to="/suite">
            <Building2 aria-hidden="true" />
            Continue with Microsoft
          </Link>
        </Button>
        <Text variant="small" className="text-center">
          Sign-in is protected by your organization&rsquo;s identity provider. Need help?{" "}
          <a className="text-primary underline underline-offset-4" href={`mailto:${session.supportEmail}`}>
            Contact identity support
          </a>
          .
        </Text>
      </AccessStatusFrame>
    </AccessScreenBackground>
  );
}
