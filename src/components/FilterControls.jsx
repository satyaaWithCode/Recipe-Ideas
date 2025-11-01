


// import React from 'react'

// export default function FilterControls({ timeFilter, setTimeFilter }) {
//   return (
//     <div className="flex gap-3 items-center">
//       <label className="text-sm text-gray-600">Time</label>
//       <select
//         value={timeFilter}
//         onChange={(e) => setTimeFilter(e.target.value)}
//         className="px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-orange-200"
//       >
//         <option value="any">Any</option>
//         <option value="15">Less than 15 min</option>
//         <option value="30">Less than 30 min</option>
//         <option value="60">Less than 60 min</option>
//       </select>
//     </div>
//   )
// }


// src/components/FilterControls.jsx
import React from 'react'

export default function FilterControls({ timeFilter, setTimeFilter }) {
  return (
    <div className="flex gap-3 items-center">
      <label className="text-sm text-gray-300">Time</label>

      <div className="relative">
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="appearance-none px-4 py-2 pr-10 rounded-lg border border-black/10 bg-gradient-to-br from-black/4 to-black/6 text-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400/30 backdrop-blur-sm"
          aria-label="Filter by time"
        >
          <option value="any">Any</option>
          <option value="15">Less than 15 min</option>
          <option value="30">Less than 30 min</option>
          <option value="60">Less than 60 min</option>
        </select>

        {/* arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="#ffd2c2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
