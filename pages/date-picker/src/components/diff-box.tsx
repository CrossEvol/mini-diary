import { Label } from '@/components/ui/label'

interface IProps {
  primary: string | JSX.Element | JSX.Element[]
  secondary: string | JSX.Element | JSX.Element[]
}

const DiffBox = ({ primary, secondary }: IProps) => {
  return (
    <div className="flex justify-between space-x-4">
      <div>
        <Label htmlFor="email" className="p-4 font-bold">
          To be imported
        </Label>
        <div className="min-w-96 rounded-md border-2 border-pink-400 p-4">
          {secondary}
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="p-4 font-semibold">
          To be overridden
        </Label>
        <div className="min-w-96 rounded-md border-2 border-pink-400 p-4">
          {primary}
        </div>
      </div>
    </div>
  )
}

export default DiffBox
