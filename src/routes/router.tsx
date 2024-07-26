import { createHashRouter } from 'react-router-dom'
import Layout from '../layout'
import Counter from '../views/counter'
import Home from '../views/home'
import Len from '../views/len'
import SignIn from '../views/sign-in'
import SignUp from '../views/sign-up'
import TodoList from '../views/todo-list'

export const router = createHashRouter([
    {
        path: '/',
        Component: Layout,
        children: [
            { path: '', index: true, Component: Home },
            { path: 'sign-in', Component: SignIn },
            { path: 'sign-up', Component: SignUp },
            { path: 'counter', Component: Counter },
            { path: 'todo', Component: TodoList },
            { path: 'len', Component: Len },
        ],
    },
])
