import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/auth/context/auth-context';
import { useState } from 'react';


const DeleteAccount = () => {
  const { DeleteAccount, user } = useAuth();
  const [DialogOpen, setDialogOpen] = useState<boolean | false>(false);
  const username = user?.username;
  const handleDeleteAccount = async () => {
    await DeleteAccount(username ?? '');
    setDialogOpen(true);
  }

  
 



  return (
    <Card>
      <CardHeader id="delete_account">
        <CardTitle>Delete Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col lg:py-7.5 lg:gap-7.5 gap-3">
        <div className="flex flex-col gap-5">
          <div className="text-sm text-foreground">
            We regret to see you leave. Confirm account deletion below. Your
            data will be permanently removed. Thank you for being part of our
            community. 
          </div>
         
        </div>
        <div className="flex justify-end gap-2.5">
          
          <Button variant="destructive">
            <div onClick={handleDeleteAccount}>Delete Account</div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { DeleteAccount };
