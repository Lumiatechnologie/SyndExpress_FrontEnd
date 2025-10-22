import { Link, NavLink, useLocation } from 'react-router-dom';

import { MENU_MEGA } from '@/config/menu.config';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

import { MegaMenuSubAccount } from '@/partials/mega-menu/mega-menu-sub-account';
import { MegaMenuSubAuth } from '@/partials/mega-menu/mega-menu-sub-auth';
import { MegaMenuSubNetwork } from '@/partials/mega-menu/mega-menu-sub-network';
import { MegaMenuSubProfiles } from '@/partials/mega-menu/mega-menu-sub-profiles';
import { MegaMenuSubStore } from '@/partials/mega-menu/mega-menu-sub-store';

export function MegaMenu() {
  const { pathname } = useLocation();
  const { isActive, hasActiveChild } = useMenu(pathname);

  // Items issus de ta config
  const homeItem = MENU_MEGA[0];
  const publicProfilesItem = MENU_MEGA[1];
  const myAccountItem = MENU_MEGA[2];
  const networkItem = MENU_MEGA[3];
  const authItem = MENU_MEGA[4];
  const storeItem = MENU_MEGA[5];

  // Rôle modérateur
  const raw = localStorage.getItem('auth');
  const auth = raw ? JSON.parse(raw) : null;
  const canModerate: boolean =
    Array.isArray(auth?.roles) && auth.roles.includes('ROLE_MODERATOR');

  // Classe bouton/onglet du menu
  const linkClass = `
    inline-flex flex-row items-center h-12 py-0 border-b border-transparent rounded-none bg-transparent -mb-[1px]
    text-sm text-secondary-foreground font-medium 
    hover:text-mono hover:bg-transparent 
    focus:text-mono focus:bg-transparent 
    data-[active=true]:text-mono data-[active=true]:bg-transparent data-[active=true]:border-mono 
    data-[here=true]:text-mono data-[here=true]:bg-transparent data-[here=true]:border-mono 
    data-[state=open]:text-mono data-[state=open]:bg-transparent 
  `;

  return (
    <NavigationMenu className="relative z-50">
      <NavigationMenuList className="gap-2">
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to={homeItem.path || '/'}
              className={cn(linkClass)}
              data-active={isActive(homeItem.path) || undefined}
            >
              {homeItem.title}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* User Management (Moderator only) — lien direct */}
        {canModerate && (
          <NavigationMenuItem className="relative z-50">
            <NavigationMenuLink asChild>
              <NavLink
                to="/users"
                end
                className={cn(linkClass, 'relative z-50')}
                style={{ pointerEvents: 'auto' }}
              >
                User Management
              </NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

        {/* Public Profiles */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(linkClass)}
            data-active={
              hasActiveChild(publicProfilesItem.children) || undefined
            }
          >
            {publicProfilesItem.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <MegaMenuSubProfiles items={MENU_MEGA} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* My Account Item */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(linkClass)}
            data-active={hasActiveChild(myAccountItem.children) || undefined}
          >
            {myAccountItem.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <MegaMenuSubAccount items={MENU_MEGA} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Network Item */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(linkClass)}
            data-active={
              hasActiveChild(networkItem.children || []) || undefined
            }
          >
            {networkItem.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <MegaMenuSubNetwork items={MENU_MEGA} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Store Item */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(linkClass)}
            data-active={hasActiveChild(storeItem.children || []) || undefined}
          >
            {storeItem.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <MegaMenuSubStore items={MENU_MEGA} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Authentication Item */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(linkClass)}
            data-active={hasActiveChild(authItem.children) || undefined}
          >
            {authItem.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <MegaMenuSubAuth items={MENU_MEGA} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
