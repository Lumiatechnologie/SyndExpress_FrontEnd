import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { BanknoteArrowDown, BanknoteX, UserCircle, Users, type LucideIcon } from 'lucide-react';

interface IChannelStatsItem {
  logo?: string;
  logoDark?: string;
  icon?: LucideIcon;
  info: string;
  desc: string;
  path: string;
}
type IChannelStatsItems = Array<IChannelStatsItem>;

const ChannelStats = () => {
  const items: IChannelStatsItems = [
    { icon: UserCircle, info: '142', desc: 'Habitats', path: '' },
    { icon: Users, info: '387', desc: 'Résidents', path: '' },
    {
      icon: BanknoteArrowDown,
      info: '23',
      desc: 'Paiements en attente',
      path: '',
    },
    {
      icon: BanknoteX,
      info: '8',
      desc: 'Problèmes actifs',
      path: '',
    },
  ];

  const renderItem = (item: IChannelStatsItem, index: number) => {
    const IconComponent = item.icon;
    
    return (
      <Card key={index}>
        <CardContent className="p-0 flex flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
          {item.icon && IconComponent ? (
            <IconComponent className="w-10 h-7 mt-4 ms-5 text-muted-foreground" />
          ) : null}
          <div className="flex flex-col gap-1 pb-4 px-5">
            <span className="text-3xl font-semibold text-mono">
              {item.info}
            </span>
            <span className="text-sm font-normal text-muted-forehead">
              {item.desc}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export { ChannelStats, type IChannelStatsItem, type IChannelStatsItems };
