import { demoAccessProfile } from "./access";

export type ReadyToLabelStatus = "Incomplete" | "Active" | "Completed";

export type ReadyToLabelSession = {
  id: string;
  collectionRange: string;
  location: string;
  productCategory: string;
  productCodes: string[];
  leukoreduced: "Yes" | "No";
  startedAt: string;
  startedBy: string;
  expectedCount: number;
  scannedCount: number;
  matchedCount: number;
  unmatchedCount: number;
  status: ReadyToLabelStatus;
  completedAt?: string;
  finalizedBy?: string;
  comment?: string;
};

export type ScannedUnit = {
  unitNumber: string;
  productCode: string;
  collectionDate?: string;
  location?: string;
  techId: string;
  scannedAt: string;
  status: "Matched" | "Unmatched";
};

export const readyToLabelContext = {
  user: demoAccessProfile.user,
  location: demoAccessProfile.locations[0],
};

export const readyToLabelSessions: ReadyToLabelSession[] = [
  {
    id: "rtl-2401",
    collectionRange: "Jun 10–12, 2026",
    location: "Central Laboratory",
    productCategory: "Red Blood Cells",
    productCodes: ["E0333V00", "E0336V00"],
    leukoreduced: "Yes",
    startedAt: "Jun 15, 2026 · 9:42 AM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 48,
    scannedCount: 31,
    matchedCount: 29,
    unmatchedCount: 2,
    status: "Active",
  },
  {
    id: "rtl-2399",
    collectionRange: "Jun 8–9, 2026",
    location: "Central Laboratory",
    productCategory: "Platelets",
    productCodes: ["E3077V00"],
    leukoreduced: "Yes",
    startedAt: "Jun 12, 2026 · 3:18 PM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 24,
    scannedCount: 16,
    matchedCount: 16,
    unmatchedCount: 0,
    status: "Incomplete",
  },
  {
    id: "rtl-2397",
    collectionRange: "Jun 3–5, 2026",
    location: "North Clinic",
    productCategory: "Plasma",
    productCodes: ["E2555V00"],
    leukoreduced: "No",
    startedAt: "Jun 10, 2026 · 8:15 AM",
    startedBy: "Jamie Lee · LT-1018",
    expectedCount: 36,
    scannedCount: 36,
    matchedCount: 36,
    unmatchedCount: 0,
    status: "Completed",
    completedAt: "Jun 10, 2026 · 10:06 AM",
    finalizedBy: "Jamie Lee · LT-1018",
  },
  {
    id: "rtl-2394",
    collectionRange: "May 28–30, 2026",
    location: "Central Laboratory",
    productCategory: "Red Blood Cells",
    productCodes: ["E0333V00"],
    leukoreduced: "Yes",
    startedAt: "Jun 2, 2026 · 11:02 AM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 60,
    scannedCount: 60,
    matchedCount: 58,
    unmatchedCount: 2,
    status: "Completed",
    completedAt: "Jun 2, 2026 · 1:37 PM",
    finalizedBy: "Alex Morgan · LT-1042",
    comment: "Two units excluded after product-code verification.",
  },
  {
    id: "rtl-2392",
    collectionRange: "May 25–27, 2026",
    location: "Central Laboratory",
    productCategory: "Plasma",
    productCodes: ["E2555V00"],
    leukoreduced: "No",
    startedAt: "May 28, 2026 · 8:54 AM",
    startedBy: "Jamie Lee · LT-1018",
    expectedCount: 30,
    scannedCount: 30,
    matchedCount: 30,
    unmatchedCount: 0,
    status: "Completed",
  },
  {
    id: "rtl-2391",
    collectionRange: "May 21–23, 2026",
    location: "East Donation Center",
    productCategory: "Red Blood Cells",
    productCodes: ["E0333V00", "E0336V00"],
    leukoreduced: "Yes",
    startedAt: "May 24, 2026 · 11:06 AM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 52,
    scannedCount: 47,
    matchedCount: 46,
    unmatchedCount: 1,
    status: "Incomplete",
  },
  {
    id: "rtl-2390",
    collectionRange: "May 17–19, 2026",
    location: "North Clinic",
    productCategory: "Platelets",
    productCodes: ["E3077V00"],
    leukoreduced: "Yes",
    startedAt: "May 20, 2026 · 2:31 PM",
    startedBy: "Jamie Lee · LT-1018",
    expectedCount: 18,
    scannedCount: 18,
    matchedCount: 18,
    unmatchedCount: 0,
    status: "Completed",
  },
  {
    id: "rtl-2389",
    collectionRange: "May 13–15, 2026",
    location: "Central Laboratory",
    productCategory: "Plasma",
    productCodes: ["E2555V00", "E2556V00"],
    leukoreduced: "No",
    startedAt: "May 16, 2026 · 9:18 AM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 40,
    scannedCount: 40,
    matchedCount: 39,
    unmatchedCount: 1,
    status: "Completed",
  },
  {
    id: "rtl-2388",
    collectionRange: "May 8–10, 2026",
    location: "West Hospital",
    productCategory: "Red Blood Cells",
    productCodes: ["E0333V00"],
    leukoreduced: "Yes",
    startedAt: "May 11, 2026 · 7:46 AM",
    startedBy: "Priya Shah · LT-1087",
    expectedCount: 64,
    scannedCount: 22,
    matchedCount: 22,
    unmatchedCount: 0,
    status: "Active",
  },
  {
    id: "rtl-2387",
    collectionRange: "May 4–6, 2026",
    location: "Mobile Collection Unit",
    productCategory: "Platelets",
    productCodes: ["E3077V00", "E3078V00"],
    leukoreduced: "Yes",
    startedAt: "May 7, 2026 · 4:12 PM",
    startedBy: "Priya Shah · LT-1087",
    expectedCount: 28,
    scannedCount: 28,
    matchedCount: 28,
    unmatchedCount: 0,
    status: "Completed",
  },
  {
    id: "rtl-2386",
    collectionRange: "Apr 29–May 1, 2026",
    location: "East Donation Center",
    productCategory: "Plasma",
    productCodes: ["E2556V00"],
    leukoreduced: "No",
    startedAt: "May 2, 2026 · 10:03 AM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 36,
    scannedCount: 33,
    matchedCount: 32,
    unmatchedCount: 1,
    status: "Incomplete",
  },
  {
    id: "rtl-2385",
    collectionRange: "Apr 25–27, 2026",
    location: "North Clinic",
    productCategory: "Red Blood Cells",
    productCodes: ["E0336V00"],
    leukoreduced: "Yes",
    startedAt: "Apr 28, 2026 · 1:27 PM",
    startedBy: "Jamie Lee · LT-1018",
    expectedCount: 44,
    scannedCount: 44,
    matchedCount: 44,
    unmatchedCount: 0,
    status: "Completed",
  },
  {
    id: "rtl-2384",
    collectionRange: "Apr 20–22, 2026",
    location: "Central Laboratory",
    productCategory: "Platelets",
    productCodes: ["E3078V00"],
    leukoreduced: "Yes",
    startedAt: "Apr 23, 2026 · 8:42 AM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 20,
    scannedCount: 11,
    matchedCount: 11,
    unmatchedCount: 0,
    status: "Active",
  },
  {
    id: "rtl-2383",
    collectionRange: "Apr 16–18, 2026",
    location: "West Hospital",
    productCategory: "Plasma",
    productCodes: ["E2555V00"],
    leukoreduced: "No",
    startedAt: "Apr 19, 2026 · 3:48 PM",
    startedBy: "Priya Shah · LT-1087",
    expectedCount: 26,
    scannedCount: 26,
    matchedCount: 25,
    unmatchedCount: 1,
    status: "Completed",
  },
  {
    id: "rtl-2382",
    collectionRange: "Apr 12–14, 2026",
    location: "Mobile Collection Unit",
    productCategory: "Red Blood Cells",
    productCodes: ["E0333V00", "E0336V00"],
    leukoreduced: "Yes",
    startedAt: "Apr 15, 2026 · 9:35 AM",
    startedBy: "Jamie Lee · LT-1018",
    expectedCount: 58,
    scannedCount: 58,
    matchedCount: 58,
    unmatchedCount: 0,
    status: "Completed",
  },
  {
    id: "rtl-2381",
    collectionRange: "Apr 8–10, 2026",
    location: "East Donation Center",
    productCategory: "Platelets",
    productCodes: ["E3077V00"],
    leukoreduced: "Yes",
    startedAt: "Apr 11, 2026 · 11:14 AM",
    startedBy: "Alex Morgan · LT-1042",
    expectedCount: 24,
    scannedCount: 19,
    matchedCount: 19,
    unmatchedCount: 0,
    status: "Incomplete",
  },
  {
    id: "rtl-2380",
    collectionRange: "Apr 4–6, 2026",
    location: "North Clinic",
    productCategory: "Plasma",
    productCodes: ["E2556V00"],
    leukoreduced: "No",
    startedAt: "Apr 7, 2026 · 2:08 PM",
    startedBy: "Priya Shah · LT-1087",
    expectedCount: 32,
    scannedCount: 7,
    matchedCount: 7,
    unmatchedCount: 0,
    status: "Active",
  },
  {
    id: "rtl-2379",
    collectionRange: "Mar 30–Apr 1, 2026",
    location: "Central Laboratory",
    productCategory: "Red Blood Cells",
    productCodes: ["E0333V00"],
    leukoreduced: "Yes",
    startedAt: "Apr 2, 2026 · 8:23 AM",
    startedBy: "Jamie Lee · LT-1018",
    expectedCount: 48,
    scannedCount: 48,
    matchedCount: 47,
    unmatchedCount: 1,
    status: "Completed",
  },
];

export const matchedUnits: ScannedUnit[] = [
  {
    unitNumber: "W042426801234",
    productCode: "E0333V00",
    collectionDate: "Jun 11, 2026",
    location: "Central Laboratory",
    techId: "LT-1042",
    scannedAt: "Jun 15, 2026 · 10:21:43 AM",
    status: "Matched",
  },
  {
    unitNumber: "W042426801226",
    productCode: "E0336V00",
    collectionDate: "Jun 11, 2026",
    location: "Central Laboratory",
    techId: "LT-1042",
    scannedAt: "Jun 15, 2026 · 10:20:19 AM",
    status: "Matched",
  },
  {
    unitNumber: "W042426801218",
    productCode: "E0333V00",
    collectionDate: "Jun 10, 2026",
    location: "Central Laboratory",
    techId: "LT-1042",
    scannedAt: "Jun 15, 2026 · 10:18:56 AM",
    status: "Matched",
  },
];

export const unmatchedUnits: ScannedUnit[] = [
  {
    unitNumber: "W042426801171",
    productCode: "E2555V00",
    techId: "LT-1042",
    scannedAt: "Jun 15, 2026 · 10:17:22 AM",
    status: "Unmatched",
  },
  {
    unitNumber: "W042426801164",
    productCode: "E0339V00",
    techId: "LT-1042",
    scannedAt: "Jun 15, 2026 · 10:15:03 AM",
    status: "Unmatched",
  },
];

export const productCategories = [
  {
    name: "Red Blood Cells",
    codes: ["E0333V00", "E0336V00", "E0339V00"],
  },
  {
    name: "Platelets",
    codes: ["E3077V00", "E3078V00"],
  },
  {
    name: "Plasma",
    codes: ["E2555V00", "E2556V00"],
  },
];

export const cannedComments = [
  "All expected units matched",
  "Unmatched units excluded after verification",
  "Expected count adjusted per supervisor review",
];
