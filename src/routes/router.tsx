import ErrorPage from '@/error-page'
import { createHashRouter, RouteObject } from 'react-router-dom'
import Layout from '../layout'
// import EditorView from '@/views/editor-view'
// import Counter from '../views/counter'
// import Home from '../views/home'
// import Len from '../views/len'
// import SignIn from '../views/sign-in'
// import SignUp from '../views/sign-up'
// import TodoList from '../views/todo-list'
import { Suspense } from 'react'
import Loading from './loading'
import React from 'react'

const EditorView = React.lazy(() => import('@/views/editor-view'))
const Counter = React.lazy(() => import('@/views/counter'))
const Home = React.lazy(() => import('@/views/home'))
const Len = React.lazy(() => import('@/views/len'))
const SignIn = React.lazy(() => import('@/views/sign-in'))
const SignUp = React.lazy(() => import('@/views/sign-up'))
const TodoList = React.lazy(() => import('@/views/todo-list'))

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { path: '', index: true, element: <Home /> },
            { path: 'sign-in', element: <SignIn /> },
            { path: 'sign-up', element: <SignUp /> },
            { path: 'counter', element: <Counter /> },
            { path: 'todo', element: <TodoList /> },
            { path: 'len', element: <Len /> },
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
