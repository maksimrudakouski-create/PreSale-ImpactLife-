import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/shared/ui/typography";

type Props = {
  expected: number;
  scanned: number;
  matched: number;
  unmatched: number;
};

export function SessionMetrics({ expected, scanned, matched, unmatched }: Props) {
  const metrics = [
    { label: "Expected", value: expected },
    { label: "Scanned", value: scanned },
    { label: "Matched", value: matched },
    { label: "Unmatched", value: unmatched },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} size="sm">
          <CardContent className="space-y-0.5">
            <Text variant="small">{metric.label}</Text>
            <Text as="div" className="text-2xl font-semibold tracking-tight">
              {metric.value}
            </Text>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
