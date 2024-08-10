import HomeView from '@/components/home-view'
import Layout from '@/layout'
import { createHashRouter, RouteObject } from 'react-router-dom'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [{ path: '', index: true, element: <HomeView /> }]
  }
]

export const router = createHashRouter(routes)
