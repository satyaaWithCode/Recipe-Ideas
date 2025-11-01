// src/components/Favorites.jsx
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
    if (i < full) stars.push(<span key={i} className="text-amber-400">★</span>)
    else if (i === full && half) stars.push(<span key={i} className="text-amber-300">★</span>)
    else stars.push(<span key={i} className="text-gray-300">★</span>)
  }
  return <div className="flex items-center gap-1 text-sm">{stars}</div>
}

/**
 * Favorites
 * - items: favorite meal objects
 * - onOpen(id), onRemove(id)
 * - userRatings: optional object
 */
export default function Favorites({ items = [], onOpen, onRemove, userRatings = {} }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-semibold mb-4">Favorites</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((i) => {
          const id = String(i.idMeal ?? i.id ?? '')
          const { rating: systemRating, pop } = deriveMetrics(id)
          const userRating = userRatings[String(id)] ?? null
          const displayed = userRating ?? systemRating

          return (
            <div key={id} className="recipe-card card-hover relative p-0">
              <div className="card-accent" />

              <div className="p-3">
                <div className="h-40 w-full rounded-lg overflow-hidden mb-3">
                  <img
                    src={i.strMealThumb}
                    alt={i.strMeal || i.name || 'Recipe image'}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-md"
                  />
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <h4 className="font-semibold text-gray-800 truncate">{i.strMeal}</h4>

                    <div className="flex items-center gap-3 mt-2">
                      <Stars value={displayed} />
                      <div className="text-sm text-gray-500 ml-1">
                        {displayed.toFixed(1)}
                        {userRating ? (
                          <span className="text-xs text-gray-400 ml-1">(you {userRating})</span>
                        ) : (
                          <span className="text-xs text-gray-400 ml-1">(community {systemRating.toFixed(1)})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="pop-badge">{pop}%</div>
                    <div className="heart-btn bg-pink-50 border-pink-100 text-pink-600">♡</div>
                  </div>
                </div>

                {/* buttons: side-by-side */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => typeof onOpen === 'function' && onOpen(id)}
                    className="flex-1 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    aria-label={`Open ${i.strMeal || 'recipe'}`}
                  >
                    View
                  </button>

                  <button
                    onClick={() => typeof onRemove === 'function' && onRemove(id)}
                    className="flex-1 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    aria-label={`Remove ${i.strMeal || 'recipe'} from favorites`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
