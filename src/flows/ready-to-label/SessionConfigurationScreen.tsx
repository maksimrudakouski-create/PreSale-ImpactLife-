import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productCategories, readyToLabelContext } from "../_mocks/readyToLabel";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  categories?: typeof productCategories;
};

type CollectionDateFieldProps = {
  id: string;
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

function CollectionDateField({ id, label, value, onChange }: CollectionDateFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button id={id} variant="outline" className="w-full justify-between font-normal">
            {format(value, "dd.MM.yyyy")}
            <CalendarIcon aria-hidden="true" className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            onSelect={(date) => {
              if (date) onChange(date);
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function SessionConfigurationScreen({ categories = productCategories }: Props) {
  const navigate = useNavigate();
  const initialCategory = categories[0];
  const [category, setCategory] = useState(initialCategory?.name ?? "");
  const [productCodes, setProductCodes] = useState<string[]>(initialCategory?.codes.slice(0, 1) ?? []);
  const [leukoreduced, setLeukoreduced] = useState<"Yes" | "No">("Yes");
  const [location, setLocation] = useState(readyToLabelContext.location.name);
  const [collectionStartDate, setCollectionStartDate] = useState(new Date(2026, 5, 10));
  const [collectionEndDate, setCollectionEndDate] = useState(new Date(2026, 5, 12));
  const activeCategory = categories.find((item) => item.name === category) ?? initialCategory;

  const resetSelection = () => {
    setCategory(initialCategory?.name ?? "");
    setProductCodes(initialCategory?.codes.slice(0, 1) ?? []);
    setLeukoreduced("Yes");
    setLocation(readyToLabelContext.location.name);
    setCollectionStartDate(new Date(2026, 5, 10));
    setCollectionEndDate(new Date(2026, 5, 12));
  };

  const updateCategory = (nextCategory: string) => {
    const next = categories.find((item) => item.name === nextCategory);
    setCategory(nextCategory);
    setProductCodes(next?.codes.slice(0, 1) ?? []);
  };

  const toggleProductCode = (code: string, checked: boolean) => {
    setProductCodes((current) =>
      checked ? [...current, code] : current.filter((currentCode) => currentCode !== code),
    );
  };

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={readyToLabelContext.user} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Button variant="ghost" size="sm" asChild className="mb-5 px-0">
          <Link to="/ready-to-label">
            <ArrowLeft aria-hidden="true" />
            Session directory
          </Link>
        </Button>

        <div className="mb-7 space-y-2">
          <Heading level={1}>Configure a new session</Heading>
          <Text variant="lead">
            Set the collection and product criteria used to create the frozen target list.
          </Text>
        </div>

        <Card>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigate({ to: "/ready-to-label/$sessionId/scanning", params: { sessionId: "rtl-2401" } });
            }}
          >
            <CardHeader className="space-y-1 pb-4">
              <Heading level={3}>Target-list parameters</Heading>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <CollectionDateField
                  id="collection-start"
                  label="Collection start date"
                  value={collectionStartDate}
                  onChange={setCollectionStartDate}
                />
                <CollectionDateField
                  id="collection-end"
                  label="Collection end date"
                  value={collectionEndDate}
                  onChange={setCollectionEndDate}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Product category</Label>
                    <Select value={category} onValueChange={updateCategory}>
                      <SelectTrigger id="product-category" className="w-full">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {categories.map((item) => (
                          <SelectItem key={item.name} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-location">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger id="session-location" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Central Laboratory">Central Laboratory · CL-01</SelectItem>
                        <SelectItem value="North Clinic">North Clinic · NC-04</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leukoreduced">Leukoreduced</Label>
                  <Select value={leukoreduced} onValueChange={(value) => setLeukoreduced(value as "Yes" | "No")}>
                    <SelectTrigger id="leukoreduced" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Heading level={4} as="div">Product codes</Heading>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeCategory?.codes.map((code) => (
                    <div key={code} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                      <Checkbox
                        id={`product-${code}`}
                        checked={productCodes.includes(code)}
                        onCheckedChange={(checked) => toggleProductCode(code, checked === true)}
                      />
                      <Label htmlFor={`product-${code}`} className="cursor-pointer font-mono text-sm">
                        {code}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
            <CardFooter className="flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" type="button" onClick={resetSelection}>
                <RotateCcw aria-hidden="true" />
                Clear selection
              </Button>
              <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
                <Button variant="ghost" type="button" asChild>
                  <Link to="/ready-to-label">Cancel</Link>
                </Button>
                <Button variant="primary" type="submit" disabled={productCodes.length === 0}>
                  Generate target list
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
