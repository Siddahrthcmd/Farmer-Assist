import Header from '../Header'
import { ThemeProvider } from '../ThemeProvider'

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <Header isAuthenticated={true} userName="രാജു കുമാർ" />
    </ThemeProvider>
  )
}