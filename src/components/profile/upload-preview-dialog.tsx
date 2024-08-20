import fetchClient from '@/utils/fetch.client'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Paper, { PaperProps } from '@mui/material/Paper'
import * as React from 'react'
import Draggable from 'react-draggable'
import {
  UploadFile,
  UploadFileResponse,
  UploadResponseCallback
} from './upload-zone'
import { ApiUrl } from '@/utils/string.util'

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

export default function UploadPreviewDialog({
  open,
  setOpen,
  file,
  onSuccess,
  onFailure
}: IDialogProps & { file: UploadFile | null } & {
  onSuccess?: UploadResponseCallback
  onFailure?: (error: unknown) => void
}) {
  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('image', file as File)

    try {
      const response = await fetchClient.postForm<UploadFileResponse>(
        `${ApiUrl()}/upload`,
        {
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (onSuccess) {
        onSuccess(response)
      }

      console.log('Image uploaded successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
      if (onFailure) {
        onFailure(error)
      }
    }
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Preview
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {file ? (
              <img
                src={file.preview}
                className="block h-auto w-96"
                // Revoke data uri after image is loaded
                onLoad={() => {
                  URL.revokeObjectURL(file.preview)
                }}
              />
            ) : (
              <img src="/static/go.jpg" className="w-96" />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Upload</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
