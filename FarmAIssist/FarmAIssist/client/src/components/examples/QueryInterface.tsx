import QueryInterface from '../QueryInterface'
import { ThemeProvider } from '../ThemeProvider'

export default function QueryInterfaceExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <QueryInterface />
      </div>
    </ThemeProvider>
  )
}