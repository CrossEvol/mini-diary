interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  plainText: string
}

const PlainTextFrame = ({ plainText, className }: IProps) => {
  return (
    <div className={`${className} min-w-96 rounded-md bg-black`}>
      <pre style={{ whiteSpace: 'pre-wrap' }} className="p-2 text-white">
        {plainText}
      </pre>
    </div>
  )
}

export default PlainTextFrame
