import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function PasswordUpdateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (data:boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col items-center pt-10 pb-10">
          <div className="mb-10">
            <img
              src={toAbsoluteUrl('/media/illustrations/21.svg')}
              className="dark:hidden max-h-[140px]"
              alt="image"
            />
            <img
              src={toAbsoluteUrl('/media/illustrations/21-dark.svg')}
              className="light:hidden max-h-[140px]"
              alt="image"
            />
          </div>

          <h3 className="text-lg font-medium text-mono text-center mb-3">
            Your Password Is Updated successfully
          </h3>
            <div className="text-sm text-center text-secondary-foreground mb-7">
                Your password has been updated successfully. You can now use your new password to log in.
            </div>
            

         

         

         
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
