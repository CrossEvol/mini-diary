import { Outlet } from 'react-router-dom'
import ContextMenuMain from './components/context-menu-warpper'

const Layout = () => {
  return (
    <div>
      <ContextMenuMain>
        <Outlet />
      </ContextMenuMain>
    </div>
  )
}

export default Layout
