import { Box, Container, Typography } from '@mui/material'
import React from 'react'

interface NoResultProps {
  searchTerm: string
}

const NoResult: React.FC<NoResultProps> = ({ searchTerm }) => {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        textAlign="center"
      >
        <Typography variant="h4" gutterBottom>
          No Results Found
        </Typography>
        <Typography variant="body1" color="textSecondary">
          We could not find any results for{' '}
          <strong className="bg-yellow-300 text-black">{searchTerm}</strong>.
        </Typography>
      </Box>
    </Container>
  )
}

export default NoResult
