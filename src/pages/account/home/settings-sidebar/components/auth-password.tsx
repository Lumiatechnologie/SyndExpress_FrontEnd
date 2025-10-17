import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getNewPasswordSchema,NewPasswordSchemaType } from '@/auth/forms/reset-password-schema';
import { useAuth } from '@/auth/context/auth-context';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader, Loader2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { WelcomeMessageDialog } from '@/partials/dialogs/welcome-message-dialog';
import { se } from 'date-fns/locale';
import { PasswordUpdateDialog } from '@/partials/dialogs/Password-changed';





const AuthPassword = () => {
  const UpdatePassword = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(getNewPasswordSchema()),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
      
    },
  });

    const [error, setError] = useState<string | null>(null);
    const [DialogOpen, setDialogOpen] = useState<boolean | false>(true);
  
    const { requestPasswordUpdate } = useAuth();
  

    async function onSubmit(values: NewPasswordSchemaType) {
      try {
       
  
        
  
        // Simple validation
        if (!values.password || !values.newPassword || !values.confirmPassword) {
          setError('password and new password are required');
          return;
        }
  
        // Sign in using the auth context
        await requestPasswordUpdate(
      
          "aymendakir",
          values.password,
          values.newPassword,
        ).then((data) => {
          setError(null);
          setDialogOpen(true);
          UpdatePassword.reset();
          console.log('Password updated successfully:', data);
           
          // Optionally, you can show a success message or redirect the user
          // setSuccessMessage('Password updated successfully');
        });

  
        // Use navigate for navigation
       
      } catch (err) {
        console.error('Unexpected sign-in error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred. Please try again.',
        );
      } 
    }
  return (
     <Form {...UpdatePassword}>
          <form
            onSubmit={UpdatePassword.handleSubmit(onSubmit)}
            className="block w-full space-y-5"
          >
            <PasswordUpdateDialog open={DialogOpen} onOpenChange={response=>{
setDialogOpen(response)
            }} />
    <Card>
      <CardHeader id="auth_password">
        <CardTitle>Password</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        {error && (
                  <Alert
                    variant="destructive"
                    appearance="light"
                    onClose={() => setError(null)}
                  >
                    <AlertIcon>
                      <AlertCircle />
                    </AlertIcon>
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Current Password</Label>
              <FormField  
              
                      control={UpdatePassword.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem 
                        className='w-full'>
                          
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">New Password</Label>

             <FormField
                      control={UpdatePassword.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Confirm New Password</Label>
             <FormField
                      control={UpdatePassword.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
           
          </div>
        </div>
        <div className="flex justify-end pt-2.5">
          <Button type='submit' disabled={UpdatePassword.formState.isSubmitting} > {UpdatePassword.formState.isSubmitting&&<Loader2 className='animate-spin'  />}Reset Password</Button>
        </div>
      </CardContent>
    </Card>
    </form>
          </Form>
  );
};

export { AuthPassword };
