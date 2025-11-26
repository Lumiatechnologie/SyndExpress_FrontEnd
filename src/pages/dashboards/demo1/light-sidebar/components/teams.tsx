'use client';

import { useMemo, useState } from 'react';
import { Avatar, AvatarGroup } from '@/partials/common/avatar-group';
import { Rating } from '@/partials/common/rating';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface IData {
  id: number;
  name: string;
  description: string;
  rating: number;
  created_at: string;
  updated_at: string;
  users: Avatar[];
}

const data: IData[] = [
  {
    id: 1,
    name: 'Résidence Les Jardins',
    description: '12 appartements - Avenue de la République',
    rating: 5,
    created_at: '21 Oct, 2024',
    updated_at: '21 Oct, 2024',
    users: [
      { path: '/media/avatars/300-4.png', fallback: 'RJ' },
      { path: '/media/avatars/300-1.png', fallback: 'RJ' },
      { path: '/media/avatars/300-2.png', fallback: 'RJ' },
      { path: '/media/avatars/300-4.png', fallback: 'RJ' },
    ],
  },
  {
    id: 2,
    name: 'Immeuble Le Panorama',
    description: '24 appartements - Boulevard des Champs',
    rating: 4.5,
    created_at: '15 Oct, 2024',
    updated_at: '15 Oct, 2024',
    users: [
      { path: '/media/avatars/300-4.png', fallback: 'IP' },
      { path: '', fallback: 'IP' },
    ],
  },
  {
    id: 3,
    name: 'Copropriété Les Pins',
    description: '8 villas - Route de la Plage',
    rating: 5,
    created_at: '10 Oct, 2024',
    updated_at: '10 Oct, 2024',
    users: [
      { path: '/media/avatars/300-4.png', fallback: 'CP' },
      { path: '/media/avatars/300-1.png', fallback: 'CP' },
      { path: '/media/avatars/300-2.png', fallback: 'CP' },
    ],
  },
  {
    id: 4,
    name: 'Résidence Le Soleil',
    description: '18 appartements - Rue du Commerce',
    rating: 4,
    created_at: '05 Oct, 2024',
    updated_at: '05 Oct, 2024',
    users: [
      { path: '/media/avatars/300-24.png', fallback: 'RS' },
      { path: '/media/avatars/300-7.png', fallback: 'RS' },
    ],
  },
  {
    id: 5,
    name: 'Immeuble Les Oliviers',
    description: '15 appartements - Avenue Victor Hugo',
    rating: 4.5,
    created_at: '01 Oct, 2024',
    updated_at: '01 Oct, 2024',
    users: [
      { path: '/media/avatars/300-3.png', fallback: 'IO' },
      { path: '/media/avatars/300-8.png', fallback: 'IO' },
      { path: '/media/avatars/300-9.png', fallback: 'IO' },
    ],
  },
  {
    id: 6,
    name: 'Résidence La Mer',
    description: '20 appartements - Promenade des Anglais',
    rating: 5,
    created_at: '25 Sep, 2024',
    updated_at: '25 Sep, 2024',
    users: [
      { path: '/media/avatars/300-6.png', fallback: 'RM' },
      { path: '/media/avatars/300-5.png', fallback: 'RM' },
    ],
  },
  {
    id: 7,
    name: 'Copropriété Le Château',
    description: '6 villas - Chemin des Collines',
    rating: 4,
    created_at: '20 Sep, 2024',
    updated_at: '20 Sep, 2024',
    users: [
      { path: '/media/avatars/300-10.png', fallback: 'CC' },
      { path: '/media/avatars/300-11.png', fallback: 'CC' },
      { path: '/media/avatars/300-12.png', fallback: 'CC' },
    ],
  },
  {
    id: 8,
    name: 'Résidence Les Roses',
    description: '14 appartements - Rue de la Paix',
    rating: 3.5,
    created_at: '15 Sep, 2024',
    updated_at: '15 Sep, 2024',
    users: [
      { path: '/media/avatars/300-13.png', fallback: 'RR' },
      { path: '/media/avatars/300-14.png', fallback: 'RR' },
    ],
  },
  {
    id: 9,
    name: 'Immeuble Le Parc',
    description: '22 appartements - Avenue du Parc',
    rating: 5,
    created_at: '10 Sep, 2024',
    updated_at: '10 Sep, 2024',
    users: [
      { path: '/media/avatars/300-15.png', fallback: 'IP' },
      { path: '/media/avatars/300-16.png', fallback: 'IP' },
    ],
  },
  {
    id: 10,
    name: 'Résidence Les Vignes',
    description: '16 appartements - Route de la Vigne',
    rating: 4,
    created_at: '05 Sep, 2024',
    updated_at: '05 Sep, 2024',
    users: [
      { path: '/media/avatars/300-17.png', fallback: 'RV' },
      { path: '/media/avatars/300-18.png', fallback: 'RV' },
      { path: '/media/avatars/300-19.png', fallback: 'RV' },
    ],
  },
  {
    id: 11,
    name: 'Copropriété Les Cyprès',
    description: '10 villas - Allée des Cyprès',
    rating: 5,
    created_at: '01 Sep, 2024',
    updated_at: '01 Sep, 2024',
    users: [
      { path: '/media/avatars/300-20.png', fallback: 'CC' },
      { path: '/media/avatars/300-21.png', fallback: 'CC' },
    ],
  },
  {
    id: 12,
    name: 'Résidence Le Clos',
    description: '19 appartements - Impasse du Clos',
    rating: 4,
    created_at: '25 Aug, 2024',
    updated_at: '25 Aug, 2024',
    users: [
      { path: '/media/avatars/300-22.png', fallback: 'RC' },
      { path: '/media/avatars/300-23.png', fallback: 'RC' },
    ],
  },
  {
    id: 13,
    name: 'Immeuble Les Tilleuls',
    description: '13 appartements - Boulevard des Tilleuls',
    rating: 3.5,
    created_at: '20 Aug, 2024',
    updated_at: '20 Aug, 2024',
    users: [
      { path: '/media/avatars/300-24.png', fallback: 'IT' },
      { path: '/media/avatars/300-25.png', fallback: 'IT' },
    ],
  },
  {
    id: 14,
    name: 'Résidence Le Jardin',
    description: '17 appartements - Rue du Jardin',
    rating: 5,
    created_at: '15 Aug, 2024',
    updated_at: '15 Aug, 2024',
    users: [
      { path: '/media/avatars/300-26.png', fallback: 'RJ' },
      { path: '/media/avatars/300-27.png', fallback: 'RJ' },
      { path: '/media/avatars/300-28.png', fallback: 'RJ' },
    ],
  },
  {
    id: 15,
    name: 'Copropriété Les Palmiers',
    description: '9 villas - Avenue des Palmiers',
    rating: 4,
    created_at: '10 Aug, 2024',
    updated_at: '10 Aug, 2024',
    users: [
      { path: '/media/avatars/300-29.png', fallback: 'CP' },
      { path: '/media/avatars/300-30.png', fallback: 'CP' },
    ],
  },
];

const Teams = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updated_at', desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 48,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'name',
        accessorFn: (row) => row.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Résidence" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <span className="leading-none font-medium text-sm text-mono hover:text-primary">
              {row.original.name}
            </span>
            <span className="text-sm text-secondary-foreground font-normal leading-3">
              {row.original.description}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 280,
        meta: {
          skeleton: (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-[125px]" />
              <Skeleton className="h-2.5 w-[90px]" />
            </div>
          ),
        },
      },
      {
        id: 'rating',
        accessorFn: (row) => row.rating,
        header: ({ column }) => (
          <DataGridColumnHeader title="Note" column={column} />
        ),
        cell: ({ row }) => (
          <Rating
            rating={Math.floor(row.original.rating)}
            round={row.original.rating % 1}
          />
        ),
        enableSorting: true,
        size: 135,
        meta: {
          skeleton: <Skeleton className="h-5 w-[60px]" />,
        },
      },
      {
        id: 'updated_at',
        accessorFn: (row) => row.updated_at,
        header: ({ column }) => (
          <DataGridColumnHeader title="Dernière MAJ" column={column} />
        ),
        cell: ({ row }) => row.original.updated_at,
        enableSorting: true,
        size: 135,
        meta: {
          skeleton: <Skeleton className="h-5 w-[70px]" />,
        },
      },
      {
        id: 'users',
        accessorFn: (row) => row.users,
        header: ({ column }) => (
          <DataGridColumnHeader title="Résidents" column={column} />
        ),
        cell: ({ row }) => (
          <AvatarGroup group={row.original.users} size="size-8" />
        ),
        enableSorting: true,
        size: 135,
        meta: {
          skeleton: <Skeleton className="h-6 w-[75px]" />,
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => String(row.id),
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
        <CardHeader className="py-3.5">
          <CardTitle>Résidences</CardTitle>
          <CardToolbar className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Rechercher une résidence..."
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
          </CardToolbar>
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

export { Teams };
