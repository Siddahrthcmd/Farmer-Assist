import ImageUpload from '../ImageUpload'
import { ThemeProvider } from '../ThemeProvider'

export default function ImageUploadExample() {
  return (
    <ThemeProvider>
      <div className="p-4 max-w-md mx-auto">
        <ImageUpload />
      </div>
    </ThemeProvider>
  )
}