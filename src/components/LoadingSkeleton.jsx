

import React from 'react'

export default function LoadingSkeleton({ count = 6 }) {
  const items = Array.from({ length: count })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((_, i) => (
        <div key={i} className="p-3 bg-white rounded-2xl shadow-sm">
          <div className="h-48 w-full bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-gradient opacity-60" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 relative overflow-hidden">
            <div className="absolute inset-0 skeleton-gradient opacity-50" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 skeleton-gradient opacity-40" />
          </div>
        </div>
      ))}
    </div>
  )
}
