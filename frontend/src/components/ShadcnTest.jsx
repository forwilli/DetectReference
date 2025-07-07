import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function ShadcnTest() {
  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Shadcn/ui Components Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>Testing shadcn/ui integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Textarea Component</label>
            <Textarea placeholder="Enter your text here..." />
          </div>
          
          <div>
            <label className="text-sm font-medium">Select Component</label>
            <Select>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Footer content</p>
        </CardFooter>
      </Card>
      
      <Alert>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          Shadcn/ui components are working correctly.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default ShadcnTest