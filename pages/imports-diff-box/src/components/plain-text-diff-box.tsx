import { Label } from '@/components/ui/label'
import PlainTextFrame from './plain-text-frame'

interface IProps {
  primary: string
  secondary: string
}

const PlainTextDiffBox = ({ primary, secondary }: IProps) => {
  return (
    <div className="flex justify-between space-x-4">
      <div>
        <Label htmlFor="email" className="p-4 font-bold">
          To be imported
        </Label>
        <PlainTextFrame plainText={secondary} />
      </div>
      <div>
        <Label htmlFor="email" className="p-4 font-semibold">
          To be overridden
        </Label>
        <PlainTextFrame plainText={primary} />
      </div>
    </div>
  )
}

export default PlainTextDiffBox
