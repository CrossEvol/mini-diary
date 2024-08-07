import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { EFormat } from '@/shared/enums'
import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'

const ContextMenuWrapper = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate()

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-screen w-screen items-center justify-center">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => navigate(`/`)}>
          {'home'}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigate(`/${EFormat.HTML}`)}>
          {EFormat.HTML}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigate(`/${EFormat.JSON}`)}>
          {EFormat.JSON}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigate(`/${EFormat.MARKDOWN}`)}>
          {EFormat.MARKDOWN}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ContextMenuWrapper
