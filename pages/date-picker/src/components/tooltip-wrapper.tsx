import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { PropsWithChildren } from 'react'

interface IProps {
  text: string
}

export function TooltipWrapper({ children, text }: PropsWithChildren & IProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="bottom" className="bg-blue-700">
          <p className="text-white">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
