
interface IProps {
  primary: string | JSX.Element | JSX.Element[]
  secondary: string | JSX.Element | JSX.Element[]
}

const DiffBox = ({ primary, secondary }: IProps) => {
  return (
    <div className="flex justify-between space-x-4">
      <div className="min-w-96 rounded-md border-2 border-pink-400 p-4">
        {primary}
      </div>
      <div className="min-w-96 rounded-md border-2 border-pink-400 p-4">
        {secondary}
      </div>
    </div>
  )
}

export default DiffBox
