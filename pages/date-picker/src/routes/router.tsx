import FallbackComponent from '@/components/fallback-component' // Import your fallback component
import React, { lazy, startTransition, Suspense } from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'
import Layout from '../layout'

const loadComponent = (
  importFunction: () => Promise<{ default: React.ComponentType<any> }>
) => {
  return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
    startTransition(() => {
      resolve(importFunction())
    })
  })
}

const HomeView = lazy(() => loadComponent(() => import('@/views/home-view')))
const HtmlTabsView = lazy(() =>
  loadComponent(() => import('@/views/html-tabs-view'))
)
const JsonTabsView = lazy(() =>
  loadComponent(() => import('@/views/json-tabs-view'))
)
const MarkdownTabsView = lazy(() =>
  loadComponent(() => import('@/views/markdown-tabs-view'))
)

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', index: true, element: <HomeView /> },
      { path: 'json', element: <JsonTabsView /> },
      { path: 'html', element: <HtmlTabsView /> },
      { path: 'md', element: <MarkdownTabsView /> }
    ].map((route) => ({
      ...route,
      element: (
        <Suspense fallback={<FallbackComponent />}>{route.element}</Suspense>
      )
    }))
  }
]

export const router = createHashRouter(routes)
