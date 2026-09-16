import type { ReactNode } from "react";
import { AnimatedBokehBackground } from "@/shared/ui/AnimatedBokehBackground";

type Props = {
  children: ReactNode;
};

/** Shared animated backdrop for the access-flow screens. */
export function AccessScreenBackground({ children }: Props) {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <AnimatedBokehBackground />
      {children}
    </div>
  );
}
