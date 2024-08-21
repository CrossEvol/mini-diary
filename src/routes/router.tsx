import ErrorPage from '@/error-page'
import React, { Suspense } from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'
import Layout from '../layout'
import Loading from './loading'

const EditorView = React.lazy(() => import('@/views/editor-view'))
const Home = React.lazy(() => import('@/views/home-view'))
const SignIn = React.lazy(() => import('@/views/sign-in'))
const SignUp = React.lazy(() => import('@/views/sign-up'))
const TodoView = React.lazy(() => import('@/views/todo-view'))
const EditorSearchView = React.lazy(() => import('@/views/editor-search-view'))
const UserProfileView = React.lazy(() => import('@/views/profile-view'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '', index: true, element: <Home /> },
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'todo', element: <TodoView /> },
      { path: 'profile', element: <UserProfileView /> },
      { path: 'editor/search', element: <EditorSearchView /> },
      { path: 'editor/:date', element: <EditorView /> }
    ].map((route) => ({
      ...route,
      element: <Suspense fallback={<Loading />}>{route.element}</Suspense>
    }))
  }
]

export const router = createHashRouter(routes)
