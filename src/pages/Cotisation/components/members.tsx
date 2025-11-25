'use client';

import { useMemo, useState } from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  EllipsisVertical,
  Filter,
  Search,
  Settings2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard.ts';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid.tsx';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header.tsx';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility.tsx';
import { DataGridPagination } from '@/components/ui/data-grid-pagination.tsx';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area.tsx';
import { Cotisation } from '../models';


const cotisations: Cotisation[] = [
  {
    id: 1,
    code: "COT-001",
    monthYear: "2025-01",
    montant: 1500,
    cotisationId: 101,
    userName: "Ayman Dakir",
    userMatricule: "USR-001",
    recapitulatifCode: "REC-2025-01"
  },
  {
    id: 2,
    code: "COT-002",
    monthYear: "2025-02",
    montant: 1750,
    cotisationId: 102,
    userName: "Sara Benali",
    userMatricule: "USR-002",
    recapitulatifCode: "REC-2025-02"
  },
  {
    id: 3,
    code: "COT-003",
    monthYear: "2025-03",
    montant: 1600,
    cotisationId: 103,
    userName: "Mohamed El Idrissi",
    userMatricule: "USR-003",
    recapitulatifCode: "REC-2025-03"
  },
  {
    id: 4,
    code: "COT-004",
    monthYear: "2025-04",
    montant: 2000,
    cotisationId: 104,
    userName: "Nadia Bouzid",
    userMatricule: "USR-004",
    recapitulatifCode: "REC-2025-04"
  },
  {
    id: 5,
    code: "COT-005",
    monthYear: "2025-05",
    montant: 1800,
    cotisationId: 105,
    userName: "Youssef Charki",
    userMatricule: "USR-005",
    recapitulatifCode: "REC-2025-05"
  }
];




function ActionsCell({ row }: { row: Row<Cotisation> }) {
  
  const { copyToClipboard } = useCopyToClipboard();
  const handleCopyId = () => {
    copyToClipboard(String(row.original.id));
    const message = `Member ID successfully copied: ${row.original.id}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Members = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'recentlyActivity', desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  /*const { getCotisations } = useAuth();
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<Cotisation[]>({
    queryKey: ['cotisations'],
    queryFn: getCotisations,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });*/

  const filteredData = useMemo(() => {
    return cotisations.filter((item) => {
      // Filter by status
     /* const matchesStatus =
        !selectedStatuses?.length ||
        selectedStatuses.includes(item.status.label);*/

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.userMatricule.toLowerCase().includes(searchLower) ||
        item.userName.toLowerCase().includes(searchLower) ||
        item.code.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [searchQuery]);
  const statusCounts = useMemo(() => {
    return cotisations.reduce(
      (acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, []);

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const columns = useMemo<ColumnDef<Cotisation>[]>(
    () => [
      {
        accessorKey: 'CotisationID',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 51,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'CotisationID',
        accessorFn: (row) => row.id,
        header: ({ column }) => (
          <DataGridColumnHeader title="CotisationID" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.id}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 300,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'RecapCode',
        accessorFn: (row) => row.code,
        header: ({ column }) => (
          <DataGridColumnHeader title="RecapCode" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.code}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 220,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'monthYear',
        accessorFn: (row) => row.monthYear,
        header: ({ column }) => (
          <DataGridColumnHeader title="MoisAnnée" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.monthYear}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 165,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'Montant',
        accessorFn: (row) => row.montant,
        header: ({ column }) => (
          <DataGridColumnHeader title="Montant" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.montant}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 165,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'userName',
        accessorFn: (row) => row.userName,
        header: ({ column }) => (
          <DataGridColumnHeader title="userName" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground font-normal">
            {row.original.userName}
          </span>
        ),
        enableSorting: true,
        size: 165,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false,
        size: 60,
        meta: {
          headerClassName: '',
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: Cotisation) => String(row.id),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>

        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline">
              <Settings2 />
              Columns
            </Button>
          }
        />
      </CardToolbar>
    );
  };

  //const hasData = filteredData.length > 0;
 /* const errorMessage =
    error instanceof Error ? error.message : 'Unable to load cotisations.';*/

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader>
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search Members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter />
                    Status
                    {selectedStatuses.length > 0 && (
                      <Badge size="sm" appearance="stroke">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-3" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Filters
                    </div>
                    <div className="space-y-3">
                      {Object.keys(statusCounts).map((status) => (
                        <div key={status} className="flex items-center gap-2.5">
                          <Checkbox
                            id={status}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) =>
                              handleStatusChange(checked === true, status)
                            }
                          />
                          <Label
                            htmlFor={status}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            {status}
                            <span className="text-muted-foreground">
                              {statusCounts[status]}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
             
            </div>
          </CardHeading>
          <Toolbar />
        </CardHeader>
        <CardTable>
          {filteredData.length > 0 ? (
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No cotisations found.
            </div>
          )}
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
     
    </DataGrid>
  );
};

export { Members };
