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
  UserRoundPlus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

interface IMember {
  avatar: string;
  name: string;
  tasks: string;
}

interface ILocation {
  name: string;
  flag: string;
}

interface IStatus {
  label: string;
  variant:
    | 'secondary'
    | 'primary'
    | 'destructive'
    | 'success'
    | 'info'
    | 'mono'
    | 'warning'
    | null
    | undefined;
}

interface IData {
  Code: string;
  MoisAnnée: string;
  Montant: number;
  CotisationID: string;
  Utilisateur: string;
  Matricule: string;
  RecapCode:string;
}

const data: IData[] = [
  { "Code": "CT001", "MoisAnnée": "04/2025", "Montant": 100, "CotisationID": "ID789", "Utilisateur": "Ali Benali", "Matricule": "MAT123", "RecapCode": "RC987" },
  { "Code": "CT002", "MoisAnnée": "04/2025", "Montant": 120, "CotisationID": "ID790", "Utilisateur": "Sara Lahlou", "Matricule": "MAT124", "RecapCode": "RC988" },
  { "Code": "CT003", "MoisAnnée": "04/2025", "Montant": 110, "CotisationID": "ID791", "Utilisateur": "Omar Fassi", "Matricule": "MAT125", "RecapCode": "RC989" },
  { "Code": "CT004", "MoisAnnée": "04/2025", "Montant": 90, "CotisationID": "ID792", "Utilisateur": "Nadia Bennis", "Matricule": "MAT126", "RecapCode": "RC990" },
  { "Code": "CT005", "MoisAnnée": "04/2025", "Montant": 130, "CotisationID": "ID793", "Utilisateur": "Youssef Idrissi", "Matricule": "MAT127", "RecapCode": "RC991" },
  { "Code": "CT006", "MoisAnnée": "04/2025", "Montant": 95, "CotisationID": "ID794", "Utilisateur": "Laila Hammou", "Matricule": "MAT128", "RecapCode": "RC992" },
  { "Code": "CT007", "MoisAnnée": "04/2025", "Montant": 105, "CotisationID": "ID795", "Utilisateur": "Karim Saidi", "Matricule": "MAT129", "RecapCode": "RC993" },
  { "Code": "CT008", "MoisAnnée": "04/2025", "Montant": 115, "CotisationID": "ID796", "Utilisateur": "Fatima Zahra", "Matricule": "MAT130", "RecapCode": "RC994" },
  { "Code": "CT009", "MoisAnnée": "04/2025", "Montant": 125, "CotisationID": "ID797", "Utilisateur": "Hassan El Khattabi", "Matricule": "MAT131", "RecapCode": "RC995" },
  { "Code": "CT010", "MoisAnnée": "04/2025", "Montant": 140, "CotisationID": "ID798", "Utilisateur": "Salma Raji", "Matricule": "MAT132", "RecapCode": "RC996" },
  { "Code": "CT011", "MoisAnnée": "04/2025", "Montant": 100, "CotisationID": "ID799", "Utilisateur": "Amine Benjelloun", "Matricule": "MAT133", "RecapCode": "RC997" },
  { "Code": "CT012", "MoisAnnée": "04/2025", "Montant": 110, "CotisationID": "ID800", "Utilisateur": "Imane Chafai", "Matricule": "MAT134", "RecapCode": "RC998" },
  { "Code": "CT013", "MoisAnnée": "04/2025", "Montant": 95, "CotisationID": "ID801", "Utilisateur": "Rachid Fadil", "Matricule": "MAT135", "RecapCode": "RC999" },
  { "Code": "CT014", "MoisAnnée": "04/2025", "Montant": 120, "CotisationID": "ID802", "Utilisateur": "Sofia El Amrani", "Matricule": "MAT136", "RecapCode": "RC1000" },
  { "Code": "CT015", "MoisAnnée": "04/2025", "Montant": 130, "CotisationID": "ID803", "Utilisateur": "Mounir Kabbaj", "Matricule": "MAT137", "RecapCode": "RC1001" },
  { "Code": "CT016", "MoisAnnée": "04/2025", "Montant": 105, "CotisationID": "ID804", "Utilisateur": "Aya El Ghazali", "Matricule": "MAT138", "RecapCode": "RC1002" },
  { "Code": "CT017", "MoisAnnée": "04/2025", "Montant": 115, "CotisationID": "ID805", "Utilisateur": "Yassin Lahlou", "Matricule": "MAT139", "RecapCode": "RC1003" },
  { "Code": "CT018", "MoisAnnée": "04/2025", "Montant": 125, "CotisationID": "ID806", "Utilisateur": "Nora Benkirane", "Matricule": "MAT140", "RecapCode": "RC1004" },
  { "Code": "CT019", "MoisAnnée": "04/2025", "Montant": 135, "CotisationID": "ID807", "Utilisateur": "Hicham Bouziane", "Matricule": "MAT141", "RecapCode": "RC1005" },
  { "Code": "CT020", "MoisAnnée": "04/2025", "Montant": 140, "CotisationID": "ID808", "Utilisateur": "Lina Rachid", "Matricule": "MAT142", "RecapCode": "RC1006" }
];


function ActionsCell({ row }: { row: Row<IData> }) {
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by status
     /* const matchesStatus =
        !selectedStatuses?.length ||
        selectedStatuses.includes(item.status.label);*/

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.Matricule.toLowerCase().includes(searchLower) ||
        item.Utilisateur.toLowerCase().includes(searchLower) ||
        item.RecapCode.toLowerCase().includes(searchLower);

      return   matchesSearch;
    });
  }, [searchQuery, selectedStatuses]);
  const statusCounts = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc[item.CotisationID] = (acc[item.CotisationID] || 0) + 1;
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

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: 'CotisationID',
        accessorFn: (row) => row.CotisationID,
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
        accessorFn: (row) => row.CotisationID,
        header: ({ column }) => (
          <DataGridColumnHeader title="CotisationID" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.CotisationID}
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
        accessorFn: (row) => row.RecapCode,
        header: ({ column }) => (
          <DataGridColumnHeader title="RecapCode" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.CotisationID}
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
        id: 'MoisAnnée',
        accessorFn: (row) => row.MoisAnnée,
        header: ({ column }) => (
          <DataGridColumnHeader title="MoisAnnée" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.MoisAnnée}
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
        accessorFn: (row) => row.Montant,
        header: ({ column }) => (
          <DataGridColumnHeader title="Montant" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">

            <span className="leading-none text-foreground font-normal">
              {row.original.Montant}
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
        id: 'Code',
        accessorFn: (row) => row.Code,
        header: ({ column }) => (
          <DataGridColumnHeader title="Code" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-secondary-foreground font-normal">
            {row.original.Code}
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
    getRowId: (row: IData) => row.CotisationID,
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
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
};

export { Members };
