import Profile from '../Profile'
import { ThemeProvider } from '../ThemeProvider'

export default function ProfileExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Profile />
      </div>
    </ThemeProvider>
  )
}