interface IProps {
  plainText: string
}

const PlainTextFrame = ({ plainText }: IProps) => {
  return (
    <div className="min-w-96 rounded-md bg-black">
      <pre style={{ whiteSpace: 'pre-wrap' }} className="p-2 text-white">
        {plainText}
      </pre>
    </div>
  )
}

export default PlainTextFrame
