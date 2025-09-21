import QueryHistory from '../QueryHistory'
import { ThemeProvider } from '../ThemeProvider'

export default function QueryHistoryExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <QueryHistory />
      </div>
    </ThemeProvider>
  )
}