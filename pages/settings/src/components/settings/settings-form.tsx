import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { GrDocumentStore, GrKey } from 'react-icons/gr'
import { HiOutlineKey } from 'react-icons/hi'
import { IoImagesSharp } from 'react-icons/io5'
import { VscOutput } from 'react-icons/vsc'
import { Button } from '../ui/button'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@/components/ui/menubar'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { isDevelopment } from '@/constants'
import { Config, EChannel, FileType, UpdateConfigResult } from 'ce-shard'
import { Controller, useForm } from 'react-hook-form'
import { IoFileTrayFullOutline } from 'react-icons/io5'
import { RxReset } from 'react-icons/rx'

interface FormValues {
  ui: {
    theme: 'system' | 'light' | 'dark'
    'main-window': {
      width: number
      height: number
      resizable: boolean
      'hide-menu': boolean
    }
    'sub-window': {
      width: number
      height: number
      resizable: boolean
      'hide-menu': boolean
    }
  }
  storage: {
    log: {
      dir: string
    }
    secret: {
      'pri-key': string
      'pub-pem': string
    }
    database: string
    images: string
  }
  system: {
    'auto-update': boolean
    'enable-notify': boolean
  }
  server: {
    fixed: boolean
    port: number
  }
}

interface IProps {
  config?: Config
}

function SettingsForm({ config }: IProps) {
  const { toast } = useToast()
  const { handleSubmit, register, control, reset, setValue } =
    useForm<FormValues>({
      defaultValues: config
    })

  const filepathInputHandler = async (field: any, filetype: FileType) => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.once(
        EChannel.GET_FILE_PATH_RESULT,
        (_event: any, value: any) => {
          setValue(field, value)
        }
      )

      ipcRenderer.send(EChannel.GET_FILE_PATH, filetype)
    }
  }

  const handleConfigSubmit = async (config: Config) => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.once(
        EChannel.UPDATE_CONFIG_RESULT,
        (_event: any, value: UpdateConfigResult) => {
          setTimeout(
            () => ipcRenderer.send(EChannel.CLOSE_SETTINGS_WINDOW),
            3000
          )
          toast({
            variant: 'default',
            title: 'Config Update, Close in 3 seconds...',
            description: JSON.stringify(value),
            action: (
              <ToastAction
                altText="Close Now!"
                onClick={() => ipcRenderer.send(EChannel.CLOSE_SETTINGS_WINDOW)}
              >
                Close Now!
              </ToastAction>
            )
          })
        }
      )

      ipcRenderer.send(EChannel.UPDATE_CONFIG, config)
    }
  }

  const onSubmit = (data: typeof config) => {
    console.log('Submitted Data:', data)
    handleConfigSubmit(data!)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>UI</AccordionTrigger>
            <AccordionContent>
              <div className="m-4 flex flex-col">
                <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-2">
                    <Label htmlFor="terms">Theme</Label>
                  </div>
                  <div className="col-span-6">
                    <Controller
                      name="ui.theme"
                      control={control}
                      render={({ field }) => (
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Main Window</AccordionTrigger>
                      <AccordionContent>
                        <div className="m-4 flex flex-col">
                          <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                            <div className="col-span-3">
                              <Label htmlFor="terms">Width</Label>
                            </div>
                            <div className="col-span-5">
                              <Input
                                type="number"
                                placeholder="1000"
                                {...register('ui.main-window.width')}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                            <div className="col-span-3">
                              <Label htmlFor="terms">Height</Label>
                            </div>
                            <div className="col-span-5">
                              <Input
                                type="number"
                                placeholder="800"
                                {...register('ui.main-window.height')}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                            <div className="col-span-3">
                              <Label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Resizable
                              </Label>
                            </div>
                            <div className="col-span-5">
                              <Controller
                                name="ui.main-window.resizable"
                                control={control}
                                render={({ field }) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    {...register('ui.main-window.resizable')}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                            <div className="col-span-3">
                              <Label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                HideMenu
                              </Label>
                            </div>
                            <div className="col-span-5">
                              <Controller
                                name="ui.main-window.hide-menu"
                                control={control}
                                render={({ field }) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    {...register('ui.main-window.hide-menu')}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Sub Window</AccordionTrigger>
                      <AccordionContent>
                        <div className="m-4 flex flex-col">
                          <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                            <div className="col-span-3">
                              <Label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Resizable
                              </Label>
                            </div>
                            <div className="col-span-5">
                              <Controller
                                name="ui.sub-window.resizable"
                                control={control}
                                render={({ field }) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    {...register('ui.sub-window.resizable')}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                            <div className="col-span-3">
                              <Label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                HideMenu
                              </Label>
                            </div>
                            <div className="col-span-5">
                              <Controller
                                name="ui.sub-window.hide-menu"
                                control={control}
                                render={({ field }) => (
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    {...register('ui.sub-window.hide-menu')}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Server</AccordionTrigger>
            <AccordionContent>
              <div className="m-4 flex flex-col">
                <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Fixed
                    </Label>
                  </div>
                  <div className="col-span-5">
                    <Controller
                      name="server.fixed"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          {...register('server.fixed')}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label htmlFor="terms">Port</Label>
                  </div>
                  <div className="col-span-5">
                    <Input
                      type="number"
                      placeholder="3000"
                      {...register('server.port')}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Storage</AccordionTrigger>
            <AccordionContent>
              <div className="m-4 flex flex-col">
                <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label htmlFor="terms">LOG_DIR</Label>
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="text"
                      placeholder="LOG_DIR"
                      {...register('storage.log.dir')}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() =>
                        filepathInputHandler('storage.log.dir', 'directory')
                      }
                    >
                      <VscOutput fontSize={'20'} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label htmlFor="terms">PRI_KEY</Label>
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="text"
                      placeholder="PRI_KEY"
                      {...register('storage.secret.pri-key')}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() =>
                        filepathInputHandler('storage.secret.pri-key', 'file')
                      }
                    >
                      <GrKey fontSize={'20'} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label htmlFor="terms">PUB_PEM</Label>
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="text"
                      placeholder="PUB_PEM"
                      {...register('storage.secret.pub-pem')}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() =>
                        filepathInputHandler('storage.secret.pub-pem', 'file')
                      }
                    >
                      <HiOutlineKey fontSize={'20'} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label htmlFor="terms">Database</Label>
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="text"
                      placeholder="Database"
                      {...register('storage.database')}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() =>
                        filepathInputHandler('storage.database', 'file')
                      }
                    >
                      <GrDocumentStore fontSize={'20'} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label htmlFor="terms">Images</Label>
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="text"
                      placeholder="Images"
                      {...register('storage.images')}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() =>
                        filepathInputHandler('storage.images', 'directory')
                      }
                    >
                      <IoImagesSharp fontSize={'20'} />
                    </button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>System</AccordionTrigger>
            <AccordionContent>
              <div className="m-4 flex flex-col">
                <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      AutoUpdate
                    </Label>
                  </div>
                  <div className="col-span-5">
                    <Controller
                      name="system.auto-update"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          {...register('system.auto-update')}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                  <div className="col-span-3">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      EnableNotification
                    </Label>
                  </div>
                  <div className="col-span-5">
                    <Controller
                      name="system.enable-notify"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          {...register('system.enable-notify')}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex w-full justify-between p-8">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="hover:bg-red-500">
                Reset
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem
                  className="focus:bg-red-500"
                  onClick={() => reset()}
                >
                  Reset Current{' '}
                  <MenubarShortcut>
                    <RxReset />
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="focus:bg-red-500">
                  Reset Full{' '}
                  <MenubarShortcut>
                    <IoFileTrayFullOutline />
                  </MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <Button className="uppercase">Submit</Button>
        </div>
      </form>
    </div>
  )
}

export default SettingsForm
