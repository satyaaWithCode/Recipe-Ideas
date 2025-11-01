



// // src/components/RecipeDetailModal.jsx
// import React, { useEffect, useRef, useState } from 'react'
// import { getRecipeById } from '../api'

// /**
//  * Helper deterministic metrics (keeps parity with cards)
//  */
// function stableHashTo01(str) {
//   let h = 2166136261 >>> 0
//   for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619) >>> 0
//   return (h % 1000) / 1000
// }
// function deriveMetrics(id) {
//   const seed = stableHashTo01(String(id || '0'))
//   const rating = Math.round((3.5 + seed * 1.5) * 10) / 10
//   const pop = Math.round(40 + seed * 58)
//   return { rating, pop }
// }

// function StarsStatic({ value }) {
//   const full = Math.floor(value)
//   const half = value - full >= 0.5
//   const items = []
//   for (let i = 0; i < 5; i++) {
//     if (i < full) items.push(<span key={i} className="text-amber-400">★</span>)
//     else if (i === full && half) items.push(<span key={i} className="text-amber-300">☆</span>)
//     else items.push(<span key={i} className="text-gray-300">☆</span>)
//   }
//   return <div className="flex items-center gap-1 text-lg">{items}</div>
// }

// function UserRatingInput({ value, onChange }) {
//   const [hover, setHover] = useState(0)
//   const renderStar = (index) => {
//     const active = hover ? hover >= index : (value >= index)
//     return (
//       <button
//         key={index}
//         onMouseEnter={() => setHover(index)}
//         onMouseLeave={() => setHover(0)}
//         onClick={() => onChange(index)}
//         className="text-2xl px-1"
//         style={{ color: active ? '#f59e0b' : '#d1d5db' }}
//         aria-label={`Rate ${index}`}
//       >
//         ★
//       </button>
//     )
//   }
//   return (
//     <div className="flex items-center gap-2" role="radiogroup" aria-label="Your rating">
//       {[1,2,3,4,5].map(renderStar)}
//       <div className="text-sm text-gray-600 ml-2">{value ? `You: ${value.toFixed(1)}` : 'Not rated'}</div>
//     </div>
//   )
// }

// export default function RecipeDetailModal({ id, onClose, onToggleFav, isFav, onUserRate, userRating: initialUserRating }) {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [userRating, setUserRating] = useState(initialUserRating ?? null)
//   const containerRef = useRef(null)
//   const titleRef = useRef(null)

//   useEffect(() => {
//     if (!id) return
//     setLoading(true)
//     setError(null)
//     setUserRating(initialUserRating ?? null)
//     getRecipeById(id)
//       .then(d => { setData(d); setLoading(false) })
//       .catch(err => { setError(err.message || 'Failed to load recipe'); setLoading(false) })
//   }, [id, initialUserRating])

//   // close on Escape & trap focus a bit (basic)
//   useEffect(() => {
//     function onKey(e) {
//       if (e.key === 'Escape') onClose?.()
//       // simple focus trap - keep focus inside modal when open and Tab pressed on last element
//       // (we keep this minimal to avoid adding third-party libs)
//     }
//     document.addEventListener('keydown', onKey)
//     return () => document.removeEventListener('keydown', onKey)
//   }, [onClose])

//   // move focus into dialog title when opened
//   useEffect(() => {
//     setTimeout(() => {
//       try { titleRef.current?.focus() } catch {}
//     }, 0)
//   }, [data])

//   if (!id) return null

//   const { rating: systemRating, pop } = deriveMetrics(id)
//   const displayedRating = userRating ? Math.round(((systemRating + userRating) / 2) * 10) / 10 : systemRating

//   const handleUserRate = (r) => {
//     setUserRating(r)
//     if (typeof onUserRate === 'function') onUserRate(String(id), r)
//   }

//   const handleBackdropMouseDown = (e) => {
//     if (e.target === e.currentTarget) onClose?.()
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur"
//       onMouseDown={handleBackdropMouseDown}
//       ref={containerRef}
//       aria-modal="true"
//       role="dialog"
//       aria-labelledby="recipe-title"
//     >
//       <div className="w-full max-w-3xl modal-inner overflow-auto max-h-[90vh] p-6 shadow-xl bg-white rounded-lg">
//         <div className="flex justify-between items-start gap-4 border-b border-orange-200 pb-3">
//           <div>
//             <h2 id="recipe-title" ref={titleRef} tabIndex={-1} className="text-3xl font-bold text-orange-600 mb-1">{data?.strMeal || 'Recipe'}</h2>

//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <div><StarsStatic value={displayedRating} /></div>
//                 <span className="text-sm text-gray-500 ml-1">{displayedRating.toFixed(1)}</span>
//               </div>
//               <div className="text-xs font-medium text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">Popularity {pop}%</div>
//             </div>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() => { if (data) onToggleFav?.({ idMeal: data.idMeal, strMeal: data.strMeal, strMealThumb: data.strMealThumb }) }}
//               className={`px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${isFav ? 'bg-pink-100 border-pink-300 text-pink-600' : 'bg-white border-orange-200 text-orange-600'}`}
//             >
//               {isFav ? '★ Favorited' : '♡ Favorite'}
//             </button>
//             <button onClick={onClose} className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md">Close</button>
//           </div>
//         </div>

//         {loading && <div className="py-10 text-center text-gray-500 text-lg animate-pulse">Loading recipe details...</div>}
//         {error && <div className="py-8 text-center text-red-500 font-medium">{error}</div>}

//         {data && (
//           <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="md:col-span-1 space-y-3">
//               <div className="overflow-hidden rounded-xl shadow-sm">
//                 <img src={data.strMealThumb} alt={data.strMeal || 'Recipe image'} className="w-full h-60 object-cover rounded-xl hover:scale-105 transition-transform duration-300" />
//               </div>

//               <div className="text-sm text-gray-700 mt-2 space-y-1">
//                 <p><span className="font-semibold">Category:</span> {data.strCategory || '—'}</p>
//                 <p><span className="font-semibold">Cuisine:</span> {data.strArea || '—'}</p>
//                 {data.strYoutube && <a href={data.strYoutube} target="_blank" rel="noreferrer" className="block mt-2 text-orange-600 underline">🎥 Watch on YouTube</a>}
//               </div>

//               <div className="mt-4">
//                 <div className="text-sm font-medium text-gray-700 mb-2">Your rating</div>
//                 <UserRatingInput value={userRating ?? 0} onChange={handleUserRate} />
//                 <div className="text-xs text-gray-500 mt-2">Your rating is saved locally in this browser.</div>
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <h4 className="text-lg font-semibold text-orange-600 mb-2">Ingredients</h4>
//               <ul className="grid grid-cols-2 gap-2 mb-4">
//                 {Array.from({ length: 20 }).map((_, i) => {
//                   const ingr = data[`strIngredient${i+1}`]
//                   const measure = data[`strMeasure${i+1}`]
//                   if (!ingr) return null
//                   return <li key={i} className="text-sm bg-orange-50/50 border border-orange-100 rounded-md px-2 py-1 flex justify-between"><span>{ingr}</span><span className="text-gray-500">{measure}</span></li>
//                 })}
//               </ul>

//               <h4 className="text-lg font-semibold text-orange-600 mb-2">Instructions</h4>
//               <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed bg-white/60 p-3 rounded-lg shadow-inner border border-orange-100">{data.strInstructions}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecipeDetailModal({
  id,
  onClose,
  onToggleFav,
  isFav,
  onUserRate,
  userRating,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const json = await res.json();
        setData(json.meals?.[0] || null);
      } catch (err) {
        setError("Failed to fetch recipe details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRecipe();
  }, [id]);

  if (!id) return null;

  const handleRating = (r) => {
    if (onUserRate) onUserRate(id, r);
  };

  return (
    <AnimatePresence>
      {id && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key={id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl text-gray-200"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition"
            >
              ✕ Close
            </button>

            {loading ? (
              <div className="p-10 text-center text-gray-400">Loading...</div>
            ) : error ? (
              <div className="p-10 text-center text-red-400">{error}</div>
            ) : !data ? (
              <div className="p-10 text-center text-gray-400">
                Recipe not found.
              </div>
            ) : (
              <div className="p-6 md:p-10 space-y-6">
                {/* Title + Meta */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                    {data.strMeal}
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onToggleFav(data)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all duration-300 ${
                        isFav
                          ? "bg-pink-600 text-white"
                          : "bg-white/10 text-gray-200 border border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {isFav ? "★ Favorited" : "♡ Favorite"}
                    </button>
                  </div>
                </div>

                {/* Main Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <img
                      src={data.strMealThumb}
                      alt={data.strMeal}
                      className="rounded-2xl shadow-lg w-full object-cover"
                    />
                    <div className="mt-4 text-sm">
                      <p>
                        <span className="font-semibold text-orange-400">
                          Category:
                        </span>{" "}
                        {data.strCategory || "—"}
                      </p>
                      <p>
                        <span className="font-semibold text-orange-400">
                          Cuisine:
                        </span>{" "}
                        {data.strArea || "—"}
                      </p>
                      {data.strYoutube && (
                        <p className="mt-2">
                          <a
                            href={data.strYoutube}
                            target="_blank"
                            rel="noreferrer"
                            className="text-pink-400 hover:text-pink-300 underline"
                          >
                            🎥 Watch on YouTube
                          </a>
                        </p>
                      )}
                    </div>

                    {/* Rating section */}
                    <div className="mt-4">
                      <p className="font-medium mb-1 text-gray-300">
                        Your rating
                      </p>
                      <div className="flex gap-1 text-2xl">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <span
                            key={r}
                            onClick={() => handleRating(r)}
                            className={`cursor-pointer ${
                              userRating >= r
                                ? "text-yellow-400"
                                : "text-gray-500"
                            } hover:text-yellow-300 transition`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Your rating is saved locally in this browser.
                      </p>
                    </div>
                  </div>

                  {/* Ingredients + Instructions */}
                  <div className="col-span-2 space-y-6">
                    {/* 🍳 Ingredients */}
                    <div>
                      <h4 className="text-lg font-semibold text-orange-400 mb-3">
                        Ingredients
                      </h4>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const ingr = data[`strIngredient${i + 1}`]?.trim();
                          const measure = data[`strMeasure${i + 1}`]?.trim();
                          if (!ingr) return null;
                          return (
                            <li
                              key={i}
                              className="flex items-center justify-between text-sm bg-white/10 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-sm hover:bg-white/15 transition"
                            >
                              <span className="truncate text-gray-100">
                                {ingr}
                              </span>
                              <span className="text-gray-400 ml-4">
                                {measure || "—"}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* 📖 Instructions */}
                    <div>
                      <h4 className="text-lg font-semibold text-orange-400 mb-2">
                        Instructions
                      </h4>
                      <p className="text-gray-200 leading-relaxed whitespace-pre-line bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                        {data.strInstructions || "No instructions available."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
