import VoiceInput from '../VoiceInput'
import { ThemeProvider } from '../ThemeProvider'

export default function VoiceInputExample() {
  return (
    <ThemeProvider>
      <div className="p-4 max-w-md mx-auto">
        <VoiceInput />
      </div>
    </ThemeProvider>
  )
}