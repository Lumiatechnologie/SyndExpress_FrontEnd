import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar.tsx';
import { Link } from 'react-router';
import { useSettings } from '@/providers/settings-provider.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Container } from '@/components/common/container.tsx';
import { AccountSettingsPlainContent } from './index.ts';

export function AccountSettingsPlainPage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      {/* <PageNavbar /> */}
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Clean, Efficient User Experience
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button variant="outline">
                <Link to="#">Public Profile</Link>
              </Button>
              <Button>
                <Link to="#">Get Started</Link>
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <AccountSettingsPlainContent />
      </Container>
    </Fragment>
  );
}
