'use client'

import { useState } from 'react'

interface DetectionFormProps {
  onSubmit: (text: string) => Promise<void>
  isLoading: boolean
}

export default function DetectionForm({ onSubmit, isLoading }: DetectionFormProps) {
  const [text, setText] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    await onSubmit(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
          Enter text to analyze
        </label>
        <textarea
          id="text"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          placeholder="Paste your text here..."
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Detect AI Content'}
      </button>
    </form>
  )
} 