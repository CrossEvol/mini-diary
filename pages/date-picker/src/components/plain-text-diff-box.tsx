import PlainTextFrame from './plain-text-frame'

interface IProps {
  primary: string
  secondary: string
}

const PlainTextDiffBox = ({ primary, secondary }: IProps) => {
  return (
    <div className="flex justify-between space-x-4">
      <PlainTextFrame plainText={primary} />
      <PlainTextFrame plainText={secondary} />
    </div>
  )
}

export default PlainTextDiffBox
