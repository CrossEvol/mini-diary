import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { PropsWithChildren } from 'react'

export function TooltipWrapper({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="bottom" className="bg-blue-700">
          <p className="text-white">Combine or Override?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
