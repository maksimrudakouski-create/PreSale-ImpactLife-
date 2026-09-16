export type PortalApplication = {
  id: string;
  name: string;
  description: string;
  actionLabel: string;
};

export type PortalLocation = {
  id: string;
  name: string;
  code: string;
  detail: string;
};

export type AccessProfile = {
  user: {
    name: string;
    email: string;
    role: string;
  };
  applications: PortalApplication[];
  locations: PortalLocation[];
};

/**
 * Presentation-only identity and entitlement data.
 * Integration replaces this with Entra claims and the security-group mapping.
 */
export const demoAccessProfile: AccessProfile = {
  user: {
    name: "Alex Morgan",
    email: "alex.morgan@impactlife.org",
    role: "Lab technician",
  },
  applications: [
    {
      id: "ready-to-label",
      name: "Ready to Label",
      description: "Build a target list, scan eligible units, and finalize an auditable label session.",
      actionLabel: "Open Ready to Label",
    },
    {
      id: "quality-review",
      name: "Quality Review",
      description: "Review quality events and prepare supporting records for compliance follow-up.",
      actionLabel: "Open Quality Review",
    },
    {
      id: "collection-operations",
      name: "Collection Operations",
      description: "Monitor collection activity and coordinate operational work across mobile sites.",
      actionLabel: "Open Collection Operations",
    },
  ],
  locations: [
    {
      id: "central-lab",
      name: "Central Laboratory",
      code: "CL-01",
      detail: "Main campus · specimen intake",
    },
    {
      id: "north-clinic",
      name: "North Clinic",
      code: "NC-04",
      detail: "North campus · mobile collection",
    },
  ],
};
