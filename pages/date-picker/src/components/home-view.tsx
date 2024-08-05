import { Button } from '@/components/ui/button'
import { ipcRenderer } from 'electron'

export default function HomeView() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button
        onClick={() =>
          ipcRenderer.send('click_message', new Date().toISOString())
        }
      >
        Click me
      </Button>
    </div>
  )
}
