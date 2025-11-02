import { Fragment, useState } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar.tsx';
import { useSettings } from '@/providers/settings-provider.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Container } from '@/components/common/container.tsx';
import { AccountTeamMembersContent } from './index.ts';
import { AddCotisationDialog } from './components/add-cotisation-dialog';
import { UserRoundPlus } from 'lucide-react';

export function AccountTeamMembersPage() {
  const { settings } = useSettings();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Overview of all cotisations.
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <Button onClick={() => setDialogOpen(true)}>
                <UserRoundPlus className="size-4" />
                Add Cotisation
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <AccountTeamMembersContent />
      </Container>
      <AddCotisationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(newCotisation) => {
          // Handle the new cotisation here
          console.log('New cotisation:', newCotisation);
          // You can add it to your data array or call an API
        }}
      />
    </Fragment>
  );
}
