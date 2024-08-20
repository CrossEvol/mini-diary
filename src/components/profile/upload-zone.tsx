import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { Button } from '@mui/material'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import UploadPreviewDialog from './upload-preview-dialog'

export type UploadFileResponse = {
  local_path: string
  avatar_url: string
}

export type UploadResponseCallback = (resp: UploadFileResponse) => void

export type UploadFile = File & { preview: string }

const UploadZone = ({
  onSuccess,
  onFailure
}: {
  onSuccess?: UploadResponseCallback
  onFailure?: (error: unknown) => void
}) => {
  const [file, setFile] = useState<UploadFile | null>(null)
  const [open, setOpen] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/bmp': ['.bmp'],
      'image/tiff': ['.tiff', '.tif'],
      'image/svg+xml': ['.svg'],
      'image/x-icon': ['.ico'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif']
    },
    onDropAccepted(files, _event) {
      console.log('onDropAccepted')
      console.log(files)
      setOpen(true)
    },
    onDrop: (acceptedFiles: File[]) => {
      console.log('onDrop')
      setFile(
        acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )[0]
      )
    },
    onDropRejected(fileRejections, _event) {
      console.log('onDropRejected')
      console.error(JSON.stringify(fileRejections[0]?.errors))
    }
  })

  return (
    <section>
      <div className="flex max-w-36 justify-between p-2">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Button
            onClick={(e) => e.preventDefault()}
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
          >
            Upload
          </Button>
        </div>
        <UploadPreviewDialog
          open={open}
          setOpen={setOpen}
          file={file}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </div>
    </section>
  )
}

export default UploadZone
