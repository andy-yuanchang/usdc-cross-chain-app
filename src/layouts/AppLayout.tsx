import ErrorBoundary from '@/components/ErrorBoundary'
import NavBar from '@/components/navigation/NavBar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col max-w-[1200px] p-3 mx-auto">
        <NavBar />
        <main className="flex-1">
          <div className="fixed left-0 top-0 w-screen h-screen -z-10 bg-black">
            <img
              style={{ width: '100%', height: '100%' }}
              src="/bungee-background.svg"
              alt="Bungee Background"
            />
          </div>
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  )
}
