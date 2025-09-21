import { ThemeProvider } from '../ThemeProvider'

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Theme Provider Example</h3>
        <p className="text-muted-foreground">This component wraps the entire app to provide theme context.</p>
        <div className="bg-card p-4 rounded-md border">
          <p>Content with theme-aware styling</p>
        </div>
      </div>
    </ThemeProvider>
  )
}