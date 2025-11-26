import { DropdownMenu4 } from '@/partials/dropdown-menu/dropdown-menu-4';
import {
  RemixiconComponentType,
  RiBankLine,
  RiFacebookCircleLine,
  RiGoogleLine,
  RiInstagramLine,
  RiStore2Line,
} from '@remixicon/react';
import {
  ArrowDown,
  ArrowUp,
  EllipsisVertical,
  type LucideIcon,
} from 'lucide-react';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IHighlightsRow {
  icon: LucideIcon | RemixiconComponentType;
  text: string;
  total: number;
  stats: number;
  increase: boolean;
}
type IHighlightsRows = Array<IHighlightsRow>;

interface IHighlightsItem {
  badgeColor: string;
  label: string;
}
type IHighlightsItems = Array<IHighlightsItem>;

interface IHighlightsProps {
  limit?: number;
}

const Highlights = ({ limit }: IHighlightsProps) => {
  const rows: IHighlightsRows = [
    {
      icon: RiStore2Line,
      text: 'Cotisations',
      total: 245,
      stats: 5.2,
      increase: true,
    },
    {
      icon: RiFacebookCircleLine,
      text: 'Charges Communes',
      total: 128,
      stats: 2.1,
      increase: false,
    },
    {
      icon: RiInstagramLine,
      text: 'Prestations',
      total: 67,
      stats: 12.5,
      increase: true,
    },
    {
      icon: RiGoogleLine,
      text: 'Maintenance',
      total: 43,
      stats: 8.7,
      increase: true,
    },
    { icon: RiBankLine, text: 'Fonds Réserves', total: 89, stats: 1.3, increase: false },
  ];

  const items: IHighlightsItems = [
    { badgeColor: 'bg-green-500', label: 'Payé' },
    { badgeColor: 'bg-destructive', label: 'En attente' },
    { badgeColor: 'bg-violet-500', label: 'En retard' },
  ];

  const renderRow = (row: IHighlightsRow, index: number) => {
    return (
      <div
        key={index}
        className="flex items-center justify-between flex-wrap gap-2"
      >
        <div className="flex items-center gap-1.5">
          <row.icon className="size-4.5 text-muted-foreground" />
          <span className="text-sm font-normal text-mono">{row.text}</span>
        </div>
        <div className="flex items-center text-sm font-medium text-foreground gap-6">
          <span className="lg:text-right">€{row.total}k</span>
          <span className="flex items-center justify-end gap-1">
            {row.increase ? (
              <ArrowUp className="text-green-500 size-4" />
            ) : (
              <ArrowDown className="text-destructive size-4" />
            )}
            {row.stats}%
          </span>
        </div>
      </div>
    );
  };

  const renderItem = (item: IHighlightsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1.5">
        <BadgeDot className={item.badgeColor} />
        <span className="text-sm font-normal text-foreground">
          {item.label}
        </span>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Highlights</CardTitle>
        <DropdownMenu4
          trigger={
            <Button variant="ghost" mode="icon">
              <EllipsisVertical />
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-secondary-foreground">
            Total cotisations
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-semibold text-mono">€245.7k</span>
            <Badge size="sm" variant="success" appearance="outline">
              +5.2%
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-1.5">
          <div className="bg-green-500 h-2 w-full max-w-[60%] rounded-xs"></div>
          <div className="bg-destructive h-2 w-full max-w-[25%] rounded-xs"></div>
          <div className="bg-violet-500 h-2 w-full max-w-[15%] rounded-xs"></div>
        </div>
        <div className="flex items-center flex-wrap gap-4 mb-1">
          {items.map((item, index) => {
            return renderItem(item, index);
          })}
        </div>
        <div className="border-b border-input"></div>
        <div className="grid gap-3">{rows.slice(0, limit).map(renderRow)}</div>
      </CardContent>
    </Card>
  );
};

export {
  Highlights,
  type IHighlightsRow,
  type IHighlightsRows,
  type IHighlightsItem,
  type IHighlightsItems,
  type IHighlightsProps,
};
