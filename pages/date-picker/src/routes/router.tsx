import FallbackComponent from '@/components/fallback-component'; // Import your fallback component
import { lazy, Suspense } from 'react';
import { createHashRouter, RouteObject } from 'react-router-dom';
import Layout from '../layout';

const HomeView = lazy(() => import('@/views/home-view'))
const HtmlTabsView = lazy(() => import('@/views/html-tabs-view'))
const JsonTabsView = lazy(() => import('@/views/json-tabs-view'))
const MarkdownTabsView = lazy(() => import('@/views/markdown-tabs-view'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', index: true, element: <HomeView /> },
      { path: 'json', element: <JsonTabsView /> },
      { path: 'html', element: <HtmlTabsView /> },
      { path: 'md', element: <MarkdownTabsView /> },
    ].map((route) => ({
      ...route,
      element: (
        <Suspense fallback={<FallbackComponent />}>{route.element}</Suspense>
      )
    }))
  }
]

export const router = createHashRouter(routes)
