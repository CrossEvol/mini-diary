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
import { FiSettings } from 'react-icons/fi'
import { GrDocumentStore, GrKey } from 'react-icons/gr'
import { HiOutlineKey } from 'react-icons/hi'
import { IoImagesSharp } from 'react-icons/io5'
import { VscOutput } from 'react-icons/vsc'
import { Button } from '../ui/button'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import SettingsHeader from './settings-header'
import { RxReset } from 'react-icons/rx'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@/components/ui/menubar'
import { IoFileTrayFullOutline } from 'react-icons/io5'

const config = {
  ui: {
    theme: 'system',
    'main-window': {
      width: 1000,
      height: 800,
      resizable: true,
      'hide-menu': false
    },
    'sub-window': {
      width: 1000,
      height: 800,
      resizable: false,
      'hide-menu': true
    }
  },
  storage: {
    log: {
      dir: 'logs'
    },
    secret: {
      'pri-key': 'private.key',
      'pub-key': 'public.pem'
    },
    database: 'sqlite.db',
    images: '/static'
  },
  system: {
    'auto-update': false,
    notification: true
  },
  server: {
    fixed: false,
    port: 4444
  }
}

function Settings() {
  return (
    <div className="w-full">
      <SettingsHeader />
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
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder="System"
                        defaultValue={'system'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
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
                            <Input type="number" placeholder="1000" />
                          </div>
                        </div>
                        <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                          <div className="col-span-3">
                            <Label htmlFor="terms">Height</Label>
                          </div>
                          <div className="col-span-5">
                            <Input type="number" placeholder="800" />
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
                            <Switch />
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
                            <Switch />
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
                            <Switch />
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
                            <Switch />
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
                  <Switch />
                </div>
              </div>
              <div className="grid grid-cols-8 items-center border-b-2 border-dotted border-gray-200 p-2">
                <div className="col-span-3">
                  <Label htmlFor="terms">Port</Label>
                </div>
                <div className="col-span-5">
                  <Input type="number" placeholder="3000" />
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
                  <Input type="text" placeholder="LOG_DIR" />
                </div>
                <div className="col-span-1">
                  <button onClick={() => alert('1')}>
                    <VscOutput fontSize={'20'} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                <div className="col-span-3">
                  <Label htmlFor="terms">PRI_KEY</Label>
                </div>
                <div className="col-span-4">
                  <Input type="text" placeholder="PRI_KEY" />
                </div>
                <div className="col-span-1">
                  <button onClick={() => alert('2')}>
                    <GrKey fontSize={'20'} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                <div className="col-span-3">
                  <Label htmlFor="terms">PUB_PEM</Label>
                </div>
                <div className="col-span-4">
                  <Input type="text" placeholder="PUB_PEM" />
                </div>
                <div className="col-span-1">
                  <button onClick={() => alert('3')}>
                    <HiOutlineKey fontSize={'20'} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                <div className="col-span-3">
                  <Label htmlFor="terms">Database</Label>
                </div>
                <div className="col-span-4">
                  <Input type="text" placeholder="Database" />
                </div>
                <div className="col-span-1">
                  <button onClick={() => alert('4')}>
                    <GrDocumentStore fontSize={'20'} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-8 items-center gap-2 border-b-2 border-dotted border-gray-200 p-2">
                <div className="col-span-3">
                  <Label htmlFor="terms">Images</Label>
                </div>
                <div className="col-span-4">
                  <Input type="text" placeholder="Images" />
                </div>
                <div className="col-span-1">
                  <button onClick={() => alert('4')}>
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
                  <Switch />
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
                  <Switch />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex w-full justify-between p-8">
        {/* <Button
          className="uppercase opacity-50 hover:opacity-100"
          variant={'destructive'}
        >
          Reset
        </Button> */}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-red-500">Reset</MenubarTrigger>
            <MenubarContent>
              <MenubarItem className="focus:bg-red-500">
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
    </div>
  )
}

export default Settings
