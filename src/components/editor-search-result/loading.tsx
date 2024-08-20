import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Skeleton from '@mui/material/Skeleton'
import * as React from 'react'

function Media() {
  return (
    <Card className="m-4 w-[60rem]">
      <CardHeader
        avatar={
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        }
        action={null}
        title={
          <Skeleton
            animation="wave"
            height={40}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={40} width="40%" />}
      />
      <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
      <CardContent>
        <React.Fragment>
          <Skeleton animation="wave" height={40} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={40} width="80%" />
        </React.Fragment>
      </CardContent>
    </Card>
  )
}

export default function Loading() {
  return (
    <div>
      <Media />
    </div>
  )
}
