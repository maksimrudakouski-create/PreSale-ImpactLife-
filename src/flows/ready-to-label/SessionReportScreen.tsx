import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Download, FileText, Printer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { matchedUnits, readyToLabelContext, readyToLabelSessions, unmatchedUnits, type ReadyToLabelSession } from "../_mocks/readyToLabel";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { SessionMetrics } from "@/shared/ui/SessionMetrics";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  sessions?: ReadyToLabelSession[];
};

export default function SessionReportScreen({ sessions = readyToLabelSessions }: Props) {
  const { sessionId } = useParams({ strict: false });
  const session = sessions.find((item) => item.id === sessionId) ?? sessions[0];
  const [actionNotice, setActionNotice] = useState("");

  if (!session) {
    return null;
  }

  const showReportAction = (action: "print" | "download") => {
    console.log(`Ready to Label ${action} report stub for ${session.id}`);
    setActionNotice(
      action === "print"
        ? "Print view prepared. Physical printing is connected during integration."
        : `ReadyToLabel_Report_${session.id.toUpperCase()}_20260615_102500.pdf is ready in this prototype.`,
    );
  };

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={readyToLabelContext.user} />
      <main className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6">
        <div className="mb-7 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Heading level={1}>Session summary report</Heading>
            <Badge>Completed report</Badge>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Text variant="lead">{session.id.toUpperCase()} · finalized session documentation</Text>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => showReportAction("print")}>
                <Printer aria-hidden="true" />
                Print
              </Button>
              <Button variant="outline" onClick={() => showReportAction("download")}>
                <Download aria-hidden="true" />
                Download PDF
              </Button>
              <Button variant="primary" asChild>
                <Link to="/ready-to-label">Return to session directory</Link>
              </Button>
            </div>
          </div>
        </div>

        {actionNotice ? (
          <Alert className="mb-5">
            <FileText aria-hidden="true" />
            <AlertTitle>Report action simulated</AlertTitle>
            <AlertDescription>{actionNotice}</AlertDescription>
          </Alert>
        ) : null}

        <SessionMetrics
          expected={session.expectedCount}
          scanned={session.scannedCount}
          matched={session.matchedCount}
          unmatched={session.unmatchedCount}
        />

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="space-y-1">
              <Heading level={3}>Session parameters</Heading>
              <Text variant="muted">Frozen at session creation for traceable reporting.</Text>
            </CardHeader>
            <CardContent className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <Text variant="small">Collection date range</Text>
                <Text>{session.collectionRange}</Text>
              </div>
              <div>
                <Text variant="small">Location</Text>
                <Text>{session.location}</Text>
              </div>
              <div>
                <Text variant="small">Product category and codes</Text>
                <Text>{session.productCategory} · {session.productCodes.join(", ")}</Text>
              </div>
              <div>
                <Text variant="small">Leukoreduced</Text>
                <Text>{session.leukoreduced}</Text>
              </div>
              <div>
                <Text variant="small">Started</Text>
                <Text>{session.startedAt}</Text>
              </div>
              <div>
                <Text variant="small">Started by</Text>
                <Text>{session.startedBy}</Text>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <Heading level={3}>Completion record</Heading>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Text variant="small">Finalized by</Text>
                <Text>{session.finalizedBy ?? readyToLabelContext.user.name}</Text>
              </div>
              <div>
                <Text variant="small">Session end date/time</Text>
                <Text>{session.completedAt ?? "Prototype completion timestamp"}</Text>
              </div>
              <div>
                <Text variant="small">Canned comment</Text>
                <Text>{session.comment ?? "Recorded during completion"}</Text>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-5">
          <CardHeader className="space-y-1">
            <Heading level={3}>Scanned unit detail</Heading>
            <Text variant="muted">Matched and unmatched records are retained in the final session report.</Text>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit number</TableHead>
                  <TableHead>Product code</TableHead>
                  <TableHead>Collection date</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Scan date/time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...matchedUnits, ...unmatchedUnits].map((unit) => (
                  <TableRow key={unit.unitNumber}>
                    <TableCell className="font-mono text-xs">{unit.unitNumber}</TableCell>
                    <TableCell className="font-mono text-xs">{unit.productCode}</TableCell>
                    <TableCell>{unit.collectionDate ?? "Not matched"}</TableCell>
                    <TableCell>{unit.techId}</TableCell>
                    <TableCell>{unit.scannedAt}</TableCell>
                    <TableCell>
                      <Badge
                        variant={unit.status === "Matched" ? "secondary" : "destructive"}
                        className={
                          unit.status === "Matched"
                            ? "bg-status-completed text-status-completed-foreground"
                            : undefined
                        }
                      >
                        {unit.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
