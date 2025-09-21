import AdvisoryFeed from '../AdvisoryFeed'
import { ThemeProvider } from '../ThemeProvider'

export default function AdvisoryFeedExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <AdvisoryFeed />
      </div>
    </ThemeProvider>
  )
}