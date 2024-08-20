import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import React, { createContext, PropsWithChildren, useContext } from 'react'

type VoidFunction = () => void
type VoidCallbackFunction = (callback: VoidFunction) => void

interface MenuContextProps {
  onClose: VoidFunction
  onSubmit: VoidFunction
  onReset: VoidFunction
  onRestore: VoidFunction
  setOnClose: VoidCallbackFunction
  setOnSubmit: VoidCallbackFunction
  setOnReset: VoidCallbackFunction
  setOnRestore: VoidCallbackFunction
}

export const MenuContext = createContext<MenuContextProps>({
  onClose: function (): void {
    throw new Error('Function not implemented.')
  },
  setOnClose: function (callback: VoidFunction): void {
    callback()
  },
  onSubmit: function (): void {
    throw new Error('Function not implemented.')
  },
  setOnSubmit: function (callback: VoidFunction): void {
    callback()
  },
  onReset: function (): void {
    throw new Error('Function not implemented.')
  },
  setOnReset: function (callback: VoidFunction): void {
    callback()
  },
  onRestore: function (): void {
    throw new Error('Function not implemented.')
  },
  setOnRestore: function (callback: VoidFunction): void {
    callback()
  }
})

const ContextMenuMain = ({ children }: PropsWithChildren) => {
  const { onClose, onSubmit, onReset, onRestore } = useContext(MenuContext)

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-screen w-screen items-center justify-center">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onClose}>Close</ContextMenuItem>
        <ContextMenuItem onClick={onSubmit}>Submit</ContextMenuItem>
        <ContextMenuItem onClick={onReset}>Reset</ContextMenuItem>
        <ContextMenuItem onClick={() => onRestore()}>Restore</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const voidFun = () => {}

const ContextMenuProvider = ({ children }: PropsWithChildren) => {
  const [onClose, setOnClose] = React.useState<VoidFunction>(voidFun)
  const [onSubmit, setOnSubmit] = React.useState<VoidFunction>(voidFun)
  const [onReset, setOnReset] = React.useState<VoidFunction>(voidFun)
  const [onRestore, setOnRestore] = React.useState<VoidFunction>(voidFun)

  return (
    <MenuContext.Provider
      value={{
        onClose,
        setOnClose,
        onSubmit,
        setOnSubmit,
        onReset,
        setOnReset,
        onRestore,
        setOnRestore
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

const ContextMenuWrapper = ({ children }: PropsWithChildren) => {
  return (
    <ContextMenuProvider>
      <ContextMenuMain>{children}</ContextMenuMain>
    </ContextMenuProvider>
  )
}

export default ContextMenuWrapper
