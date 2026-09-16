import { useState, type DragEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, FileText, FilterX, GripVertical, MapPin, Play, Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { readyToLabelContext, readyToLabelSessions, type ReadyToLabelSession } from "../_mocks/readyToLabel";
import { PortalHeader } from "@/shared/ui/PortalHeader";
import { SessionStatusBadge } from "@/shared/ui/SessionStatusBadge";
import { Heading, Text } from "@/shared/ui/typography";

type Props = {
  sessions?: ReadyToLabelSession[];
};

type SortKey = "id" | "collectionRange" | "location" | "productCategory" | "progress" | "status";
type SortDirection = "ascending" | "descending";

type SortState = {
  key: SortKey;
  direction: SortDirection;
};

type DropPosition = "before" | "after";

type DropTarget = {
  column: SortKey;
  position: DropPosition;
};

type SortableColumn = {
  label: string;
  align?: "left" | "right";
};

type SortableTableHeadProps = {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (sortKey: SortKey) => void;
  align?: "left" | "right";
  isDragging: boolean;
  dropPosition?: DropPosition;
  onColumnDragStart: (event: DragEvent<HTMLTableHeaderCellElement>, sortKey: SortKey) => void;
  onColumnDragOver: (event: DragEvent<HTMLTableHeaderCellElement>, sortKey: SortKey) => void;
  onColumnDrop: (event: DragEvent<HTMLTableHeaderCellElement>, sortKey: SortKey) => void;
  onColumnDragEnd: () => void;
};

const sortableColumns: Record<SortKey, SortableColumn> = {
  id: { label: "Session" },
  collectionRange: { label: "Collection range" },
  location: { label: "Location" },
  productCategory: { label: "Product" },
  progress: { label: "Scan progress", align: "right" },
  status: { label: "Status" },
};

const defaultColumnOrder: SortKey[] = [
  "id",
  "collectionRange",
  "location",
  "productCategory",
  "progress",
  "status",
];

const dropTargetCellClassNames: Record<DropPosition, string> = {
  before: "relative bg-table-drop-target/50 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary",
  after: "relative bg-table-drop-target/50 after:absolute after:inset-y-0 after:right-0 after:w-0.5 after:bg-primary",
};

const statusOrder = {
  Active: 0,
  Incomplete: 1,
  Completed: 2,
} satisfies Record<ReadyToLabelSession["status"], number>;

function getSortValue(session: ReadyToLabelSession, sortKey: SortKey) {
  switch (sortKey) {
    case "id":
      return session.id;
    case "collectionRange":
      return new Date(`${session.collectionRange.split("–")[0]}, 2026`).getTime();
    case "location":
      return session.location;
    case "productCategory":
      return session.productCategory;
    case "progress":
      return session.scannedCount / session.expectedCount;
    case "status":
      return statusOrder[session.status];
  }
}

function SortableTableHead({
  label,
  sortKey,
  sort,
  onSort,
  align = "left",
  isDragging,
  dropPosition,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragEnd,
}: SortableTableHeadProps) {
  const isSorted = sort.key === sortKey;
  const SortIcon = sort.direction === "ascending" ? ArrowUp : ArrowDown;
  const nextDirection = isSorted && sort.direction === "ascending" ? "descending" : "ascending";

  return (
    <TableHead
      aria-sort={isSorted ? sort.direction : "none"}
      className={`${align === "right" ? "text-right " : ""}relative cursor-grab active:cursor-grabbing ${isDragging ? "opacity-50" : ""} ${dropPosition ? "bg-table-drop-target/50" : ""} ${dropPosition === "before" ? "before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-primary" : ""} ${dropPosition === "after" ? "after:absolute after:inset-y-1 after:right-0 after:w-0.5 after:rounded-full after:bg-primary" : ""}`}
      draggable
      onDragStart={(event) => onColumnDragStart(event, sortKey)}
      onDragOver={(event) => onColumnDragOver(event, sortKey)}
      onDrop={(event) => onColumnDrop(event, sortKey)}
      onDragEnd={onColumnDragEnd}
      title={`Drag to reorder the ${label} column`}
    >
      <Button
        variant="ghost"
        size="sm"
        className={align === "right" ? "ml-auto" : "-ml-2"}
        onClick={() => onSort(sortKey)}
        aria-label={`Sort by ${label}, ${nextDirection}`}
      >
        <GripVertical aria-hidden="true" className="size-3 text-muted-foreground" />
        {label}
        {isSorted ? <SortIcon aria-hidden="true" /> : null}
      </Button>
    </TableHead>
  );
}

function SessionTableCell({
  session,
  column,
  dropPosition,
}: {
  session: ReadyToLabelSession;
  column: SortKey;
  dropPosition?: DropPosition;
}) {
  const dropTargetClassName = dropPosition ? dropTargetCellClassNames[dropPosition] : undefined;

  switch (column) {
    case "id":
      return (
        <TableCell className={dropTargetClassName}>
          <div className="space-y-0.5">
            <Text as="div" className="font-medium">
              {session.id.toUpperCase()}
            </Text>
            <Text variant="small">Started {session.startedAt}</Text>
          </div>
        </TableCell>
      );
    case "collectionRange":
      return <TableCell className={dropTargetClassName}>{session.collectionRange}</TableCell>;
    case "location":
      return <TableCell className={dropTargetClassName}>{session.location}</TableCell>;
    case "productCategory":
      return (
        <TableCell className={dropTargetClassName}>
          <div className="space-y-0.5">
            <Text as="div">{session.productCategory}</Text>
            <Text variant="mono">{session.productCodes.join(" · ")}</Text>
          </div>
        </TableCell>
      );
    case "progress":
      return <TableCell className={`text-right tabular-nums ${dropTargetClassName ?? ""}`}>{session.scannedCount} / {session.expectedCount}</TableCell>;
    case "status":
      return <TableCell className={dropTargetClassName}><SessionStatusBadge status={session.status} /></TableCell>;
  }
}

export default function SessionDirectoryScreen({ sessions = readyToLabelSessions }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState<SortState>({ key: "id", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnOrder, setColumnOrder] = useState<SortKey[]>(defaultColumnOrder);
  const [draggedColumn, setDraggedColumn] = useState<SortKey | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const hasActiveFilters = status !== "all" || location !== "all";
  const locations = [...new Set(sessions.map((session) => session.location))];
  const visibleSessions = sessions.filter((session) => {
    const matchesQuery = [session.id, session.productCategory, session.startedBy]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === "all" || session.status === status;
    const matchesLocation = location === "all" || session.location === location;

    return matchesQuery && matchesStatus && matchesLocation;
  }).sort((firstSession, secondSession) => {
    const firstValue = getSortValue(firstSession, sort.key);
    const secondValue = getSortValue(secondSession, sort.key);
    const comparison = typeof firstValue === "number" && typeof secondValue === "number"
      ? firstValue - secondValue
      : String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true });

    return sort.direction === "ascending" ? comparison : -comparison;
  });
  const totalPages = Math.max(1, Math.ceil(visibleSessions.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * pageSize;
  const paginatedSessions = visibleSessions.slice(pageStart, pageStart + pageSize);

  const handleSort = (sortKey: SortKey) => {
    setSort((currentSort) => ({
      key: sortKey,
      direction: currentSort.key === sortKey && currentSort.direction === "ascending" ? "descending" : "ascending",
    }));
    setCurrentPage(1);
  };

  const handleColumnDragStart = (event: DragEvent<HTMLTableHeaderCellElement>, sortKey: SortKey) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sortKey);
    setDraggedColumn(sortKey);
    setDropTarget(null);
  };

  const handleColumnDragOver = (event: DragEvent<HTMLTableHeaderCellElement>, targetColumn: SortKey) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (draggedColumn === targetColumn) {
      setDropTarget(null);
      return;
    }

    const targetBounds = event.currentTarget.getBoundingClientRect();
    const position = event.clientX < targetBounds.left + targetBounds.width / 2 ? "before" : "after";

    setDropTarget({ column: targetColumn, position });
  };

  const handleColumnDrop = (event: DragEvent<HTMLTableHeaderCellElement>, targetColumn: SortKey) => {
    event.preventDefault();
    const sourceColumn = draggedColumn ?? event.dataTransfer.getData("text/plain") as SortKey;
    const position = dropTarget?.column === targetColumn ? dropTarget.position : "before";

    if (!sourceColumn || sourceColumn === targetColumn || !columnOrder.includes(sourceColumn)) {
      setDraggedColumn(null);
      setDropTarget(null);
      return;
    }

    setColumnOrder((currentOrder) => {
      const sourceIndex = currentOrder.indexOf(sourceColumn);
      const targetIndex = currentOrder.indexOf(targetColumn);
      const nextOrder = [...currentOrder];
      const insertionIndex = targetIndex + (position === "after" ? 1 : 0);

      nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(sourceIndex < insertionIndex ? insertionIndex - 1 : insertionIndex, 0, sourceColumn);

      return nextOrder;
    });
    setDraggedColumn(null);
    setDropTarget(null);
  };

  return (
    <div className="min-h-svh bg-muted/30">
      <PortalHeader user={readyToLabelContext.user} />
      <main className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Heading level={1}>Ready to Label | Session directory</Heading>
              <Badge variant="outline" className="self-center translate-y-0.5">
                <MapPin data-icon="inline-start" aria-hidden="true" />
                {readyToLabelContext.location.name}
              </Badge>
            </div>
            <Text variant="lead" className="max-w-2xl">
              Review active, incomplete, and completed label sessions for your authorized location.
            </Text>
          </div>
          <Button variant="primary" asChild>
            <Link to="/ready-to-label/configure">
              <Plus aria-hidden="true" />
              Start new session
            </Link>
          </Button>
        </div>

        <Card className="mb-5">
          <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <Heading level={3}>Find a session</Heading>
              <Text variant="muted">Filters affect the directory only in this prototype.</Text>
            </div>
            <div className="grid w-full items-end gap-3 sm:grid-cols-3 lg:max-w-3xl lg:grid-cols-[minmax(0,1fr)_10rem_10rem]">
              <div className="relative sm:col-span-3 lg:col-span-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  aria-label="Search sessions"
                  className={query ? "px-8" : "pl-8"}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Session ID or product"
                />
                {query ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="absolute top-1/2 right-1 -translate-y-1/2"
                    aria-label="Clear search"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setQuery("");
                      setCurrentPage(1);
                    }}
                  >
                    <X aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
              <Select value={status} onValueChange={(value) => {
                setStatus(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger aria-label="Filter by status" className="w-full">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Incomplete">Incomplete</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-1">
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="link"
                    size="xs"
                    className="self-end px-0 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setStatus("all");
                      setLocation("all");
                      setCurrentPage(1);
                    }}
                  >
                    <FilterX aria-hidden="true" />
                    Clear all filters
                  </Button>
                ) : null}
                <Select value={location} onValueChange={(value) => {
                  setLocation(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger aria-label="Filter by location" className="w-full">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card id="session-directory" className="py-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {columnOrder.map((column) => (
                    <SortableTableHead
                      key={column}
                      label={sortableColumns[column].label}
                      sortKey={column}
                      sort={sort}
                      onSort={handleSort}
                      align={sortableColumns[column].align}
                      isDragging={draggedColumn === column}
                      dropPosition={dropTarget?.column === column ? dropTarget.position : undefined}
                      onColumnDragStart={handleColumnDragStart}
                      onColumnDragOver={handleColumnDragOver}
                      onColumnDrop={handleColumnDrop}
                      onColumnDragEnd={() => {
                        setDraggedColumn(null);
                        setDropTarget(null);
                      }}
                    />
                  ))}
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSessions.map((session) => (
                  <TableRow key={session.id}>
                    {columnOrder.map((column) => (
                      <SessionTableCell
                        key={column}
                        session={session}
                        column={column}
                        dropPosition={dropTarget?.column === column ? dropTarget.position : undefined}
                      />
                    ))}
                    <TableCell className="text-right">
                      {session.status === "Completed" ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/ready-to-label/$sessionId/report" params={{ sessionId: session.id }}>
                            <FileText aria-hidden="true" />
                            Report
                          </Link>
                        </Button>
                      ) : (
                        <Button size="sm" asChild>
                          <Link to="/ready-to-label/$sessionId/scanning" params={{ sessionId: session.id }}>
                            <Play aria-hidden="true" />
                            Resume
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {visibleSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      <Text>No sessions match these filters.</Text>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="fixed right-0 bottom-0 left-0 z-30 border-t bg-background/95 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
            <div className="flex items-center gap-2">
              <Text variant="small">Rows per page</Text>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger aria-label="Rows per page" className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {[10, 20, 50, 70, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 ? (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#session-directory"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((current) => Math.max(1, current - 1));
                      }}
                      className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                      aria-disabled={page === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#session-directory"
                        isActive={page === pageNumber}
                        onClick={(event) => {
                          event.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#session-directory"
                      onClick={(event) => {
                        event.preventDefault();
                        setCurrentPage((current) => Math.min(totalPages, current + 1));
                      }}
                      className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
                      aria-disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
            </div>
          </div>
      </main>
    </div>
  );
}
