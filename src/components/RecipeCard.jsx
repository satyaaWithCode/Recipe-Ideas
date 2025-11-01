




// src/components/RecipeCard.jsx
import React from 'react'

function stableHashTo01(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0
  }
  return (h % 1000) / 1000
}
function deriveMetrics(id) {
  const seed = stableHashTo01(String(id || '0'))
  const rating = Math.round((3.5 + seed * 1.5) * 10) / 10
  const pop = Math.round(40 + seed * 58)
  return { rating, pop }
}

function Stars({ value }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < full)
      stars.push(
        <span key={i} className="text-amber-400 text-lg">★</span>
      )
    else if (i === full && half)
      stars.push(
        <span key={i} className="text-amber-300 text-lg">★</span>
      )
    else
      stars.push(
        <span key={i} className="text-gray-300 text-lg">★</span>
      )
  }
  return <div className="flex items-center">{stars}</div>
}

export default function RecipeCard({
  meal,
  onOpen,
  onToggleFav,
  isFav,
  userRating = null,
}) {
  const id = String(meal.idMeal)
  const { rating: systemRating, pop } = deriveMetrics(id)

  // If user rated, show their full rating; else show system
  const displayedRating = userRating ?? systemRating

  return (
    <div className="recipe-card card-hover relative rounded-2xl shadow-md overflow-hidden bg-white">
      <div className="p-3">
        <div className="h-44 w-full rounded-lg overflow-hidden mb-3 relative">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal || 'Recipe image'}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-md"
          />
          <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            {pop}%
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1 pr-3">
            <h3 className="font-semibold text-lg text-gray-800 truncate">{meal.strMeal}</h3>

            <div className="flex items-center gap-2 mt-2">
              <Stars value={displayedRating} />
              <span className="text-sm text-gray-600 ml-1">
                {displayedRating.toFixed(1)}
                {userRating && (
                  <span className="text-xs text-gray-400 ml-1">(community {systemRating.toFixed(1)})</span>
                )}
              </span>
            </div>

            {userRating && (
              <div className="text-xs text-pink-600 mt-1 font-medium">You rated: {userRating}</div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => onToggleFav && onToggleFav(meal)}
              className={`heart-btn w-8 h-8 rounded-full flex items-center justify-center border ${isFav ? 'bg-red-50 border-red-200 text-pink-600' : 'border-gray-200 hover:bg-pink-50 text-gray-400'}`}
              title={isFav ? 'Unfavorite' : 'Favorite'}
            >
              {isFav ? '❤' : '♡'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
      <button
  onClick={() => onOpen(meal.idMeal)}
  className="w-full mt-3 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-600 shadow-md hover:shadow-lg hover:from-orange-400 hover:to-pink-500 transform hover:-translate-y-0.5 transition-all duration-300"
>
  View
</button>
        </div>
      </div>
    </div>
  )
}
