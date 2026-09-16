import { useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, CheckCircle2, Save } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cannedComments, readyToLabelContext, readyToLabelSessions, type ReadyToLabelSession } from "../_mocks/readyToLabel";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { SessionMetrics } from "@/shared/ui/SessionMetrics";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  sessions?: ReadyToLabelSession[];
};

export default function CompletionScreen({ sessions = readyToLabelSessions }: Props) {
  const navigate = useNavigate();
  const { sessionId } = useParams({ strict: false });
  const session = sessions.find((item) => item.id === sessionId) ?? sessions[0];
  const [cannedComment, setCannedComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  if (!session) {
    return null;
  }

  const needsComment = session.matchedCount !== session.expectedCount || session.unmatchedCount > 0;

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={readyToLabelContext.user} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-7">
          <div className="space-y-2">
            <Button type="button" variant="ghost" asChild className="-ml-3">
              <Link to="/ready-to-label/$sessionId/scanning" params={{ sessionId: session.id }}>
                <ArrowLeft aria-hidden="true" />
                Return to scanning
              </Link>
            </Button>
            <Heading level={1}>Review session discrepancies</Heading>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Text variant="lead">{session.id.toUpperCase()} · confirm the session is ready to finalize.</Text>
              <Button type="button" variant="outline" onClick={() => setSaved(true)}>
                <Save aria-hidden="true" />
                Save in progress
              </Button>
            </div>
          </div>
        </div>

        {saved ? (
          <Alert className="mb-5">
            <CheckCircle2 aria-hidden="true" />
            <AlertTitle>Progress saved</AlertTitle>
            <AlertDescription>The scan state remains available for a later completion attempt.</AlertDescription>
          </Alert>
        ) : null}

        <SessionMetrics
          expected={session.expectedCount}
          scanned={session.scannedCount}
          matched={session.matchedCount}
          unmatched={session.unmatchedCount}
        />

        <Card className="mt-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (needsComment && !cannedComment) {
                setShowValidation(true);
                return;
              }
              navigate({ to: "/ready-to-label/$sessionId/report", params: { sessionId: session.id } });
            }}
            >
            <CardHeader className="pb-2">
              <Heading level={3}>Completion rationale</Heading>
            </CardHeader>
            <CardContent className="space-y-5">
              {needsComment ? (
                <Alert variant="destructive" className="rounded-none border-0 bg-transparent px-0 py-0">
                  <AlertTitle>Discrepancy requires a comment</AlertTitle>
                  <AlertDescription>
                    {session.expectedCount - session.matchedCount} expected units are not matched and {session.unmatchedCount} unmatched units remain.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <CheckCircle2 aria-hidden="true" />
                  <AlertTitle>Counts reconciled</AlertTitle>
                  <AlertDescription>All expected units are matched and no discrepancy comment is required.</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="canned-comment">Canned comment {needsComment ? "(required)" : "(optional)"}</Label>
                <Select value={cannedComment} onValueChange={setCannedComment}>
                  <SelectTrigger id="canned-comment" className="w-full" aria-invalid={showValidation && !cannedComment}>
                    <SelectValue placeholder="Select a compliance comment" />
                  </SelectTrigger>
                  <SelectContent>
                    {cannedComments.map((comment) => (
                      <SelectItem key={comment} value={comment}>{comment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showValidation && !cannedComment ? (
                  <Text variant="small" className="text-destructive">Select a canned comment before completing the session.</Text>
                ) : null}
              </div>

              <div className="space-y-2 pb-6">
                <Label htmlFor="free-text-comment">Additional details (optional)</Label>
                <Textarea
                  id="free-text-comment"
                  placeholder="Add any details needed for audit review."
                  className="min-h-28"
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="ghost">
                    Cancel session
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertTriangle aria-hidden="true" />
                    <AlertDialogTitle>Cancel this session?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This exits to the session directory. Production cancellation and audit handling are
                      connected during integration.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep reviewing</AlertDialogCancel>
                    <AlertDialogAction onClick={() => navigate({ to: "/ready-to-label" })}>
                      Cancel session
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit" variant="primary">
                Complete session
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
