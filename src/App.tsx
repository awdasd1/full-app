import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">React Chat Application</h1>
      <p className="mb-4">Welcome to the chat application</p>
      <div className="flex gap-2">
        <Button 
          onClick={() => setCount((count) => count + 1)}
          variant="default"
        >
          Count is {count}
        </Button>
        <Button variant="outline">Login</Button>
      </div>
    </div>
  )
}

export default App
