import * as React from 'react'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

export default function TodoListLoading() {
    return (
        <Stack spacing={1}>
            {/* For variant="text", adjust the height via font-size */}
            <Stack
                direction={'row'}
                spacing={2}
                justifyContent={'space-between'}
            >
                <Skeleton variant='rounded' width={280} height={60} />
                <Skeleton variant='circular' width={40} height={40} />
            </Stack>
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant='rectangular' width={420} height={60} />
            <Skeleton variant='rounded' width={420} height={60} />
            <Skeleton variant='rectangular' width={420} height={60} />
            <Skeleton variant='rounded' width={420} height={60} />
        </Stack>
    )
}
