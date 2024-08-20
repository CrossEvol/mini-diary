import { Divider } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import React from 'react'

const TodoListLoading = () => {
  return (
    <Stack direction={'row'} spacing={2}>
      <Stack spacing={2}>
        {/* For variant="text", adjust the height via font-size */}
        <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
          <Skeleton variant="rounded" width={280} height={60} />
          <Skeleton variant="circular" width={40} height={40} />
        </Stack>
        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="rectangular" width={420} height={60} />
        <Skeleton variant="rounded" width={420} height={60} />
        <Skeleton variant="rectangular" width={420} height={60} />
        <Skeleton variant="rounded" width={420} height={60} />
      </Stack>
      <Divider orientation="vertical" flexItem />
      <Stack spacing={2}>
        <Skeleton variant="rectangular" width={420} height={60} />
        <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
          {Array.from({ length: 7 }).map((_, idx) => (
            <Skeleton key={idx} variant="rounded" width={60} height={40} />
          ))}
        </Stack>
        <Divider />
        {Array.from({ length: 4 }).map((_, idx) => (
          <Stack
            key={idx}
            direction={'row'}
            spacing={1}
            justifyContent={'space-evenly'}
          >
            {Array.from({ length: 7 }).map((_, idx) => (
              <Skeleton key={idx} variant="circular" width={40} height={40} />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export default React.memo(TodoListLoading)
