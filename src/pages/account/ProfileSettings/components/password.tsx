"use client";

import { useAuth } from '@/auth/context/auth-context.ts';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { PasswordUpdateDialog } from '@/partials/dialogs/Password-changed.tsx';
import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster } from "@/components/ui/sonner.tsx";
import {toast} from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { DialogFooter } from '@/components/ui/dialog.tsx';







const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      }),
      confirmerPassword:z
      .string()
      .min(6, "New password must be at least 6 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      }),
  })
  .superRefine(({ oldPassword, newPassword,confirmerPassword }, ctx) => {
    if (oldPassword ==newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New password cannot be the same as old password",
        path: ['newPassword']
      });
    }
    if (newPassword !== confirmerPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmerPassword']
      });
    }
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;









const Password = () => {
  const { requestPasswordUpdate,user } = useAuth();
 
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);


  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmerPassword:"",
    },
  });



  const username = user?.username;



  const onSubmit = async (values: PasswordFormValues) => {
    if (!username){
      toast.error("Somhting worng try again after relogine");
    }else{

    
    try {
    await requestPasswordUpdate(username, values.oldPassword, values.newPassword)

      toast.success("Password updated successfully");
      form.reset();
      setDialogOpen(true)
    } catch (err: any) {
      const errorMessage = err.data  || "Current password is incorrect";
      toast.error(errorMessage);
      
    }
  }
  };


 {/*const handlePasswordUpdate = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await requestPasswordUpdate(username??"", "Idemia@o23", "Idemia@o22");
      setSuccess(res?.data?.message);
      if((res as any)?.status === 200){
        setDialogOpen(true)
      }
    } catch (err: any) {
      console.error("Password update failed:", err);
      setError(err.response?.data?.message || "Failed to update password ❌");
    } finally {
      setLoading(false);
    }
  };*/}

  return (
    <>
      {dialogOpen && <PasswordUpdateDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
      <Toaster/>
      <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="pb-2.5">
      <CardHeader id="password_settings">
        <CardTitle>Password</CardTitle>
      </CardHeader>
     
     <CardContent className="grid gap-5">
    
          
          <FormField 
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem className=''>
                  <div className='!flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
                  <FormLabel className='flex w-full max-w-56'>Current Password</FormLabel>
                  <FormControl>
                    <Input type='text'  placeholder="Your current password" {...field} />
                  </FormControl>
                  </div>
                 
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className=''>
                  <div className='!flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
                  <FormLabel className='flex w-full max-w-56'>New Password</FormLabel>
                  <FormControl>
                    <Input type='text'  placeholder="New Password" {...field} />
                  </FormControl>
                  </div>
                 
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="confirmerPassword"
              render={({ field }) => (
                <FormItem className=''>
                  <div className='!flex items-baseline flex-wrap lg:flex-nowrap gap-2.5'>
                  <FormLabel className='flex w-full max-w-56'>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type='text'  placeholder="Confirm New Password" {...field} />
                  </FormControl>
                  </div>
                 
                  <FormMessage  />
                </FormItem>
              )}
            />
             <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>

      </CardContent>
      </Card> 
          </form>
          </Form>
    </>
  );
};

export { Password };
