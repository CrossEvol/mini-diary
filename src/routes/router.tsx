import ErrorPage from '@/error-page'
import React, { Suspense } from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'
import Layout from '../layout'
import Loading from './loading'

const EditorView = React.lazy(() => import('@/views/editor-view'))
const Home = React.lazy(() => import('@/views/home'))
const SignIn = React.lazy(() => import('@/views/sign-in'))
const SignUp = React.lazy(() => import('@/views/sign-up'))
const TodoList = React.lazy(() => import('@/views/todo-list'))
const TodoTest = React.lazy(() => import('@/views/todo-test'))
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
            { path: 'todo', element: <TodoList /> },
            { path: 'todo-test', element: <TodoTest /> },
            { path: 'profile', element: <UserProfileView /> },
            { path: 'editor/:date', element: <EditorView /> },
        ].map((route) => ({
            ...route,
            element: (
                <Suspense fallback={<Loading />}>{route.element}</Suspense>
            ),
        })),
    },
]

export const router = createHashRouter(routes)
