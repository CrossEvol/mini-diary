import { CopyIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface IProps {
  triggerButton: React.ReactNode
  description: React.ReactNode
  onClose?: () => void
  confirmText?: string
}

export function ConfirmDialog({
  triggerButton,
  description,
  onClose,
  confirmText
}: IProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Final Confirmation</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="size-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onClose}>
              {confirmText ?? 'Confirm'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
