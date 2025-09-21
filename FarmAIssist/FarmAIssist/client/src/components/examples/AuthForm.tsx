import AuthForm from '../AuthForm'
import { ThemeProvider } from '../ThemeProvider'

export default function AuthFormExample() {
  return (
    <ThemeProvider>
      <AuthForm mode="signup" />
    </ThemeProvider>
  )
}