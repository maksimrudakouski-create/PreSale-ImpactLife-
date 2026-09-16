// src/flows/routes.tsx
//
// DESIGNER-OWNED. The declarative route tree: structure and navigation only.
// There is deliberately no `loader` or `guard` field — there's nowhere to put
// logic, which is what keeps this folder safe to own.
//
// /app/router.tsx consumes this tree generically and builds the real router
// from it. Adding a screen = drop a component in src/flows/<name>/ and add an
// entry here. You never touch /app.
//
// Param syntax is `:id` (readable). The bridge in /app translates it to
// TanStack's `$id` — don't write `$id` here.

import type { ComponentType } from "react";
import AccessDeniedScreen from "./access/AccessDeniedScreen";
import ApplicationPreviewScreen from "./access/ApplicationPreviewScreen";
import LocationSelectionScreen from "./access/LocationSelectionScreen";
import NoLocationScreen from "./access/NoLocationScreen";
import ScanningWorkspaceScreen from "./access/ScanningWorkspaceScreen";
import SignInScreen from "./access/SignInScreen";
import SignedOutScreen from "./access/SignedOutScreen";
import SuiteLandingScreen from "./access/SuiteLandingScreen";
import CompletionScreen from "./ready-to-label/CompletionScreen";
import ScanningScreen from "./ready-to-label/ScanningScreen";
import SessionConfigurationScreen from "./ready-to-label/SessionConfigurationScreen";
import SessionDirectoryScreen from "./ready-to-label/SessionDirectoryScreen";
import SessionReportScreen from "./ready-to-label/SessionReportScreen";

export type FlowRoute = {
  /** "/" | "loans" | ":id". Nested under the parent's path. */
  path: string;
  /** The screen. Omit on a node that exists purely to group children. */
  component?: ComponentType;
  children?: FlowRoute[];
  /**
   * Design annotation ONLY — grouping/labels for the DevBar and the Flow Map.
   * NOT enforcement: `meta.role: "admin"` restricts nothing.
   * Real role guards are dev's, in /app.
   */
  meta?: {
    role?: string;
    flow?: string;
    label?: string;
    /** Sample values so detail routes are clickable, e.g. { id: "1001" }. */
    sampleParams?: Record<string, string>;
  };
};

export const routes: FlowRoute[] = [
  {
    path: "/",
    component: SignInScreen,
    meta: { role: "guest", flow: "Access", label: "Sign in" },
  },
  {
    path: "suite",
    component: SuiteLandingScreen,
    meta: { role: "suite user", flow: "Access", label: "Suite landing" },
  },
  {
    path: "applications/:applicationId",
    component: ApplicationPreviewScreen,
    meta: {
      role: "suite user",
      flow: "Access",
      label: "Test application",
      sampleParams: { applicationId: "quality-review" },
    },
  },
  {
    path: "location",
    component: LocationSelectionScreen,
    meta: { role: "lab technician", flow: "Access", label: "Location selection" },
  },
  {
    path: "scanning/:locationId",
    component: ScanningWorkspaceScreen,
    meta: {
      role: "lab technician",
      flow: "Access",
      label: "Scanning workspace",
      sampleParams: { locationId: "central-lab" },
    },
  },
  {
    path: "access-denied",
    component: AccessDeniedScreen,
    meta: { role: "blocked", flow: "Access", label: "Application access denied" },
  },
  {
    path: "location-unavailable",
    component: NoLocationScreen,
    meta: { role: "blocked", flow: "Access", label: "Location access denied" },
  },
  {
    path: "signed-out",
    component: SignedOutScreen,
    meta: { role: "guest", flow: "Access", label: "Signed out" },
  },
  {
    path: "ready-to-label",
    component: SessionDirectoryScreen,
    meta: { role: "lab technician", flow: "Ready to Label", label: "Session directory" },
    children: [
      {
        path: "configure",
        component: SessionConfigurationScreen,
        meta: { role: "lab technician", flow: "Ready to Label", label: "Configure session" },
      },
      {
        path: ":sessionId/scanning",
        component: ScanningScreen,
        meta: {
          role: "lab technician",
          flow: "Ready to Label",
          label: "Scan units",
          sampleParams: { sessionId: "rtl-2401" },
        },
      },
      {
        path: ":sessionId/complete",
        component: CompletionScreen,
        meta: {
          role: "lab technician",
          flow: "Ready to Label",
          label: "Review discrepancies",
          sampleParams: { sessionId: "rtl-2401" },
        },
      },
      {
        path: ":sessionId/report",
        component: SessionReportScreen,
        meta: {
          role: "lab technician",
          flow: "Ready to Label",
          label: "Session report",
          sampleParams: { sessionId: "rtl-2397" },
        },
      },
    ],
  },
];
