import HomeView from '@/views/home-view'
import HtmlTabsView from '@/views/html-tabs-view'
import JsonTabsView from '@/views/json-tabs-view'
import MarkdownTabsView from '@/views/markdown-tabs-view'
import { createHashRouter } from 'react-router-dom'
import Layout from '../layout'

export const router = createHashRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { path: '', index: true, Component: HomeView },
      { path: 'json', Component: JsonTabsView },
      { path: 'html', Component: HtmlTabsView },
      { path: 'markdown', Component: MarkdownTabsView }
    ]
  }
])
