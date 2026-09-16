import { useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Barcode, CheckCircle2, Save, ScanLine } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  matchedUnits,
  readyToLabelContext,
  readyToLabelSessions,
  unmatchedUnits,
  type ReadyToLabelSession,
  type ScannedUnit,
} from "../_mocks/readyToLabel";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { SessionMetrics } from "@/shared/ui/SessionMetrics";
import { SessionStatusBadge } from "@/shared/ui/SessionStatusBadge";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  sessions?: ReadyToLabelSession[];
  initialMatchedUnits?: ScannedUnit[];
  initialUnmatchedUnits?: ScannedUnit[];
};

export default function ScanningScreen({
  sessions = readyToLabelSessions,
  initialMatchedUnits = matchedUnits,
  initialUnmatchedUnits = unmatchedUnits,
}: Props) {
  const navigate = useNavigate();
  const { sessionId } = useParams({ strict: false });
  const session = sessions.find((item) => item.id === sessionId) ?? sessions[0];
  const [manualUnitNumber, setManualUnitNumber] = useState("");
  const [unmatchedRecords, setUnmatchedRecords] = useState(initialUnmatchedUnits);
  const [saveNotice, setSaveNotice] = useState("");

  if (!session) {
    return null;
  }

  const scannedCount = session.matchedCount + unmatchedRecords.length;
  const matchedCount = session.matchedCount;
  const progress = Math.min((scannedCount / session.expectedCount) * 100, 100);

  const addManualUnit = () => {
    const unitNumber = manualUnitNumber.trim();
    if (!unitNumber) {
      return;
    }

    setUnmatchedRecords((current) => [
      {
        unitNumber,
        productCode: "Pending review",
        techId: "LT-1042",
        scannedAt: "Current prototype scan",
        status: "Unmatched",
      },
      ...current,
    ]);
    setManualUnitNumber("");
  };

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={readyToLabelContext.user} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Button variant="ghost" size="sm" asChild className="mb-5 px-0">
          <Link to="/ready-to-label">
            <ArrowLeft aria-hidden="true" />
            Session directory
          </Link>
        </Button>
        <div className="mb-7">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Heading level={1}>Scan units</Heading>
              <div className="flex self-center -translate-y-px">
                <SessionStatusBadge status={session.status} />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Text variant="lead">
                {session.id.toUpperCase()} · {session.productCategory} · {session.collectionRange}
              </Text>
              <Button variant="outline" onClick={() => setSaveNotice("Session saved in progress in this prototype.")}>
                <Save aria-hidden="true" />
                Save in progress
              </Button>
            </div>
          </div>
        </div>

        {saveNotice ? (
          <Alert className="mb-5">
            <CheckCircle2 aria-hidden="true" />
            <AlertTitle>Progress saved</AlertTitle>
            <AlertDescription>{saveNotice}</AlertDescription>
          </Alert>
        ) : null}

        <SessionMetrics
          expected={session.expectedCount}
          scanned={scannedCount}
          matched={matchedCount}
          unmatched={unmatchedRecords.length}
        />

        <Card className="mt-5">
          <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <Heading level={3}>Scan a unit</Heading>
              <Text variant="muted">Use a handheld scanner or enter a 13-character unit number.</Text>
            </div>
            <Text variant="small" className="shrink-0 tabular-nums">
              {scannedCount} of {session.expectedCount} expected units
            </Text>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={progress} aria-label="Session scanning progress" />
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                addManualUnit();
              }}
            >
              <div className="relative grow">
                <Barcode
                  className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Label htmlFor="manual-unit" className="sr-only">Unit number</Label>
                <Input
                  id="manual-unit"
                  className="pl-8 font-mono"
                  value={manualUnitNumber}
                  onChange={(event) => setManualUnitNumber(event.target.value)}
                  placeholder="Scan or enter unit number"
                />
              </div>
              <Button type="submit">
                <ScanLine aria-hidden="true" />
                Add scan
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline">Test multi-code review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select the product code</DialogTitle>
                    <DialogDescription>
                      This scanned unit maps to more than one eligible product code. Select the code
                      present on the physical label.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="multi-code">Eligible product code</Label>
                    <Select defaultValue={session.productCodes[0]}>
                      <SelectTrigger id="multi-code" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {session.productCodes.map((code) => (
                          <SelectItem key={code} value={code}>{code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="primary">Use selected code</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </form>
          </CardContent>
        </Card>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heading level={3}>Matched units</Heading>
                  <Badge variant="secondary">{matchedCount}</Badge>
                </div>
                <Text variant="muted">Eligible units added to the target list.</Text>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit number</TableHead>
                    <TableHead>Product code</TableHead>
                    <TableHead>Scanned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialMatchedUnits.map((unit) => (
                    <TableRow key={unit.unitNumber}>
                      <TableCell className="font-mono text-xs">{unit.unitNumber}</TableCell>
                      <TableCell className="font-mono text-xs">{unit.productCode}</TableCell>
                      <TableCell>{unit.scannedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heading level={3}>Unmatched units</Heading>
                  <Badge variant="destructive">{unmatchedRecords.length}</Badge>
                </div>
                <Text variant="muted">Units not present in the frozen target list.</Text>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit number</TableHead>
                    <TableHead>Product code</TableHead>
                    <TableHead>Scanned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unmatchedRecords.map((unit) => (
                    <TableRow key={`${unit.unitNumber}-${unit.scannedAt}`}>
                      <TableCell className="font-mono text-xs">{unit.unitNumber}</TableCell>
                      <TableCell className="font-mono text-xs">{unit.productCode}</TableCell>
                      <TableCell>{unit.scannedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap items-stretch justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="lg" className="h-auto min-h-9">Cancel session</Button>
              </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertTriangle aria-hidden="true" />
                <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
                <AlertDialogDescription>
                  New scans in this active window will be discarded. A resumed session keeps the
                  last saved checkpoint during integration.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep scanning</AlertDialogCancel>
                <AlertDialogAction onClick={() => navigate({ to: "/ready-to-label" })}>
                  Cancel session
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="primary" size="lg" className="h-auto min-h-9" asChild>
            <Link to="/ready-to-label/$sessionId/complete" params={{ sessionId: session.id }}>
              Review and complete session
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
