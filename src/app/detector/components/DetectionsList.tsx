'use client'

interface Detection {
  id: string
  content: string
  aiScore: number
  createdAt: string
}

interface DetectionsListProps {
  detections: Detection[]
  onDelete: (id: string) => Promise<void>
}

export default function DetectionsList({ detections, onDelete }: DetectionsListProps) {
  if (!detections?.length) {
    return (
      <div className="text-gray-400 text-center py-8">
        No detections yet. Try analyzing some text!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {detections.map((detection) => (
        <div key={detection.id} className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-300 mb-2">{detection.content}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-400">AI Probability:</span>
                  <span 
                    className={`ml-2 font-semibold ${
                      detection.aiScore > 0.7 ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {Math.round(detection.aiScore * 100)}%
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(detection.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(detection.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 