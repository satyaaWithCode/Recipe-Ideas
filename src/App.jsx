


// import React, { useEffect, useState } from "react";
// import SearchBar from "./components/SearchBar";
// import FilterControls from "./components/FilterControls";
// import RecipeGrid from "./components/RecipeGrid";
// import RecipeDetailModal from "./components/RecipeDetailModal";
// import Favorites from "./components/Favorites";
// import LoadingSkeleton from "./components/LoadingSkeleton";

// import {
//   searchByIngredient,
//   getRandomRecipe,
//   getRecipesByCategory,
//   searchByName,
// } from "./api";

// const FAVS_KEY = "dishcovery:favs";
// const RATINGS_KEY = "dishcovery:userRatings";

// const loadFavorites = () => {
//   try {
//     return JSON.parse(localStorage.getItem(FAVS_KEY) || "[]");
//   } catch {
//     return [];
//   }
// };
// const saveFavorites = (arr) =>
//   localStorage.setItem(FAVS_KEY, JSON.stringify(arr || []));

// const loadUserRatings = () => {
//   try {
//     return JSON.parse(localStorage.getItem(RATINGS_KEY) || "{}");
//   } catch {
//     return {};
//   }
// };
// const saveUserRatings = (obj) => {
//   try {
//     localStorage.setItem(RATINGS_KEY, JSON.stringify(obj || {}));
//   } catch {}
// };

// export default function App() {
//   const [query, setQuery] = useState("");
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
//   const [timeFilter, setTimeFilter] = useState("any");
//   const [favorites, setFavorites] = useState(loadFavorites());
//   const [userRatings, setUserRatings] = useState(loadUserRatings());

//   useEffect(() => saveFavorites(favorites), [favorites]);
//   useEffect(() => saveUserRatings(userRatings), [userRatings]);

//   const doSearch = async (q) => {
//     if (!q || !q.trim()) {
//       setRecipes([]);
//       setQuery("");
//       setError(null);
//       return;
//     }
//     setQuery(q);
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await searchByIngredient(q);
//       const normalized = Array.isArray(res) ? res : [];
//       setRecipes(normalized);
//       if (!normalized.length)
//         setError(`No recipes found for "${q}". Try simpler terms.`);
//     } catch (err) {
//       setError(err.message || "Network error while searching");
//       setRecipes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTyping = async (q) => {
//     if (!q || q.trim().length < 2) return;
//     setError(null);
//     try {
//       const res = await searchByName(q);
//       if (res && res.length > 0) setRecipes(res);
//       else {
//         const byIng = await searchByIngredient(q);
//         setRecipes(byIng);
//       }
//     } catch (err) {
//       console.error("Typing search failed:", err);
//     }
//   };

//   const openDetail = (id) => setSelectedId(String(id));
//   const closeDetail = () => setSelectedId(null);

//   const toggleFav = (meal) => {
//     if (!meal || !meal.idMeal) return;
//     const exists = favorites.find(
//       (f) => String(f.idMeal) === String(meal.idMeal)
//     );
//     if (exists)
//       setFavorites(
//         favorites.filter((f) => String(f.idMeal) !== String(meal.idMeal))
//       );
//     else setFavorites([meal, ...favorites]);
//   };

//   const removeFav = (id) =>
//     setFavorites(favorites.filter((f) => String(f.idMeal) !== String(id)));

//   const loadRandom = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const meal = await getRandomRecipe();
//       if (meal) {
//         setRecipes([
//           {
//             idMeal: meal.idMeal,
//             strMeal: meal.strMeal,
//             strMealThumb: meal.strMealThumb,
//           },
//         ]);
//         setSelectedId(meal.idMeal);
//       } else setError("No random recipe found");
//     } catch (err) {
//       setError(err.message || "Could not fetch random recipe");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const moodPresets = [
//     { id: "quick", label: "Quick", type: "ingredient", q: "egg" },
//     { id: "comfort", label: "Comfort", type: "ingredient", q: "chicken" },
//     { id: "vegetarian", label: "Vegetarian", type: "category", q: "Vegetarian" },
//     { id: "seafood", label: "Seafood", type: "category", q: "Seafood" },
//   ];

//   const handleMoodClick = async (preset) => {
//     setLoading(true);
//     setError(null);
//     setQuery(preset.q);
//     try {
//       const res =
//         preset.type === "category"
//           ? await getRecipesByCategory(preset.q)
//           : await searchByIngredient(preset.q);
//       setRecipes(Array.isArray(res) ? res : []);
//       if (!res || res.length === 0)
//         setError(`No results for ${preset.label}`);
//     } catch (err) {
//       setError(err.message || "Failed to fetch recipes");
//       setRecipes([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUserRatingChange = (id, rating) => {
//     setUserRatings((prev) => ({ ...prev, [String(id)]: rating }));
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0B0C1A] via-[#14162B] to-[#1A1D3D] text-white">
//       {/* background glow */}
//       <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-pink-600/20 blur-[120px] rounded-full" />
//       <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-orange-500/20 blur-[120px] rounded-full" />

//       <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
//         {/* header */}
//         <header className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mb-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
//               Dishcovery
//             </h1>
//             <p className="text-sm text-gray-300">
//               Discover recipes from what you already have.
//             </p>
//           </div>
//           <div className="text-sm text-gray-400">🍳 For Taylor — Quick Recipe Ideas</div>
//         </header>

//         {/* search */}
//         <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
//           <div className="md:col-span-2 space-y-4">
//             <div className="rounded-2xl shadow-lg bg-white/10 border border-white/20 backdrop-blur-lg p-2">
//               <SearchBar onSearch={doSearch} onTyping={handleTyping} />
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={loadRandom}
//                 className="px-4 py-2 text-sm rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
//               >
//                 🎲 Random Recipe
//               </button>

//               {moodPresets.map((m) => (
//                 <button
//                   key={m.id}
//                   onClick={() => handleMoodClick(m)}
//                   className="px-4 py-2 text-sm rounded-full border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 hover:text-white transition-all duration-300"
//                 >
//                   {m.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end md:justify-start">
//             <FilterControls timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
//           </div>
//         </section>

//         {/* main content */}
//         <main>
//           {loading && <LoadingSkeleton count={8} />}
//           {error && (
//             <div className="py-4 text-center text-red-400 font-medium">{error}</div>
//           )}

//           {!loading && !recipes?.length && (
//             <div className="py-12 text-center text-gray-400">
//               No recipes found. Try{" "}
//               <button
//                 onClick={() => doSearch("chicken")}
//                 className="underline text-orange-400 hover:text-orange-300"
//               >
//                 chicken
//               </button>
//               ,{" "}
//               <button
//                 onClick={() => doSearch("tomato")}
//                 className="underline text-pink-400 hover:text-pink-300"
//               >
//                 tomato
//               </button>{" "}
//               or use Random 🍲
//             </div>
//           )}

//           {!loading && recipes?.length > 0 && (
//             <RecipeGrid
//               recipes={recipes}
//               onOpen={openDetail}
//               favorites={favorites}
//               toggleFav={(meal) => toggleFav(meal)}
//               userRatings={userRatings}
//             />
//           )}

//           <Favorites
//             items={favorites}
//             onOpen={openDetail}
//             onRemove={removeFav}
//             userRatings={userRatings}
//           />
//         </main>

//         {/* modal */}
//         {selectedId && (
//           <RecipeDetailModal
//             id={selectedId}
//             onClose={closeDetail}
//             onToggleFav={(meal) => toggleFav(meal)}
//             isFav={favorites.some((f) => String(f.idMeal) === String(selectedId))}
//             onUserRate={handleUserRatingChange}
//             userRating={userRatings[String(selectedId)] ?? null}
//           />
//         )}

//         {/* footer */}
//         <footer className="mt-16 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md shadow-xl p-8 text-center">
//           <h4 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mb-3">
//             Dishcovery
//           </h4>
//           <p className="text-gray-300 mb-5">
//             Find meals from what you already have. Fast, fresh, friendly.
//           </p>
//           <div className="flex justify-center gap-6 text-sm text-gray-400">
//             <a href="#" className="hover:text-orange-400 transition">About</a>
//             <a href="#" className="hover:text-pink-400 transition">Docs</a>
//             <a href="#" className="hover:text-orange-400 transition">GitHub</a>
//           </div>
//           <p className="mt-5 text-xs text-gray-500">
//             © {new Date().getFullYear()} Dishcovery • Made with ❤️ + TheMealDB
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// }



// src/App.jsx
import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import FilterControls from './components/FilterControls'
import RecipeGrid from './components/RecipeGrid'
import RecipeDetailModal from './components/RecipeDetailModal'
import Favorites from './components/Favorites'
import LoadingSkeleton from './components/LoadingSkeleton'
import {
  searchByIngredient,
  getRandomRecipe,
  getRecipesByCategory,
  searchByName,
  getByFirstLetter,
} from './api'

// LocalStorage helpers
const FAVS_KEY = 'dishcovery:favs'
const RATINGS_KEY = 'dishcovery:userRatings'

const loadFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')
  } catch {
    return []
  }
}
const saveFavorites = (arr) => localStorage.setItem(FAVS_KEY, JSON.stringify(arr || []))

const loadUserRatings = () => {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}')
  } catch {
    return {}
  }
}
const saveUserRatings = (obj) => {
  try {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(obj || {}))
  } catch {}
}

export default function App() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [timeFilter, setTimeFilter] = useState('any')
  const [favorites, setFavorites] = useState(loadFavorites())
  const [userRatings, setUserRatings] = useState(loadUserRatings())

  useEffect(() => { saveFavorites(favorites) }, [favorites])
  useEffect(() => { saveUserRatings(userRatings) }, [userRatings])

  // 🔹 Helper for unique IDs
  const uniqueById = (arr) => {
    const map = {}
    arr.forEach((x) => {
      if (x && (x.id || x.idMeal)) map[String(x.id || x.idMeal)] = x
    })
    return Object.values(map)
  }

  // 🔹 Smart search logic
  const doSearch = async (q) => {
    if (!q || !q.trim()) {
      setRecipes([]); setQuery(''); setError(null)
      return
    }
    setQuery(q)
    setLoading(true)
    setError(null)
    try {
      const [byName, byIngredient] = await Promise.all([
        searchByName(q).catch(() => []),
        searchByIngredient(q).catch(() => []),
      ])

      let results = []
      if (Array.isArray(byName) && byName.length) results = results.concat(byName)
      if (Array.isArray(byIngredient) && byIngredient.length) results = results.concat(byIngredient)

      // fallback: first-letter filter for partial searches
      if (results.length === 0 && q.length >= 1) {
        const letterList = await getByFirstLetter(q[0]).catch(() => [])
        const filtered = (letterList || []).filter((m) =>
          (m.name || '').toLowerCase().includes(q.toLowerCase())
        )
        results = filtered
      }

      const normalized = uniqueById(Array.isArray(results) ? results : [])
      setRecipes(normalized)
      if (!normalized.length) setError(`No recipes found for "${q}". Try simpler terms.`)
    } catch (err) {
      setError(err.message || 'Network error while searching')
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Live search while typing
  const handleTyping = async (q) => {
    if (!q || q.trim().length < 1) return
    try {
      const byName = await searchByName(q).catch(() => [])
      if (Array.isArray(byName) && byName.length) {
        setRecipes(uniqueById(byName))
        return
      }

      const byIng = await searchByIngredient(q).catch(() => [])
      if (Array.isArray(byIng) && byIng.length) {
        setRecipes(uniqueById(byIng))
        return
      }

      const letter = q[0]
      const letterList = await getByFirstLetter(letter).catch(() => [])
      const filtered = (letterList || []).filter((m) =>
        (m.name || '').toLowerCase().includes(q.toLowerCase())
      )
      setRecipes(uniqueById(filtered))
    } catch (err) {
      console.error('Typing search failed:', err)
    }
  }

  // 🔹 Favorites
  const toggleFav = (meal) => {
    if (!meal || !meal.idMeal) return
    const exists = favorites.find((f) => String(f.idMeal) === String(meal.idMeal))
    if (exists) setFavorites(favorites.filter((f) => String(f.idMeal) !== String(meal.idMeal)))
    else setFavorites([meal, ...favorites])
  }
  const removeFav = (id) => setFavorites(favorites.filter((f) => String(f.idMeal) !== String(id)))

  // 🔹 Random
  const loadRandom = async () => {
    setLoading(true)
    setError(null)
    try {
      const meal = await getRandomRecipe()
      if (meal) {
        setRecipes([{ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb }])
        setSelectedId(meal.idMeal)
      } else setError('No random recipe found')
    } catch (err) {
      setError(err.message || 'Could not fetch random recipe')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Mood filters
  const moodPresets = [
    { id: 'quick', label: 'Quick', type: 'ingredient', q: 'egg' },
    { id: 'comfort', label: 'Comfort', type: 'ingredient', q: 'chicken' },
    { id: 'vegetarian', label: 'Vegetarian', type: 'category', q: 'Vegetarian' },
    { id: 'seafood', label: 'Seafood', type: 'category', q: 'Seafood' },
  ]

  const handleMoodClick = async (preset) => {
    setLoading(true); setError(null); setQuery(preset.q)
    try {
      const res = preset.type === 'category'
        ? await getRecipesByCategory(preset.q)
        : await searchByIngredient(preset.q)
      setRecipes(Array.isArray(res) ? res : [])
      if (!res || res.length === 0) setError(`No results for ${preset.label}`)
    } catch (err) {
      setError(err.message || 'Failed to fetch recipes'); setRecipes([])
    } finally { setLoading(false) }
  }

  const handleUserRatingChange = (id, rating) => {
    setUserRatings((prev) => ({ ...prev, [String(id)]: rating }))
  }

  const openDetail = (id) => setSelectedId(String(id))
  const closeDetail = () => setSelectedId(null)

  // 🔹 Render
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-[#0b0c1a] via-[#17172b] to-[#241a2d] text-white">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-6 header-gradient p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Dishcovery
            </h1>
            <p className="text-sm text-gray-300">Discover recipes from what you already have.</p>
          </div>
          <div className="text-right text-sm text-gray-400">
            🍴 For Taylor — Quick Recipe Ideas
          </div>
        </header>

        {/* SEARCH SECTION */}
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <SearchBar onSearch={doSearch} onTyping={handleTyping} />
            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={loadRandom}
                className="text-sm px-3 py-2 rounded-lg border border-orange-300 bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-white hover:from-orange-500 hover:to-pink-500 transition-all duration-300"
              >
                🍲 Random Recipe
              </button>
              {moodPresets.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMoodClick(m)}
                  className="text-sm px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-pink-500/20 transition-all duration-200"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end md:justify-start">
            <FilterControls timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
          </div>
        </section>

        {/* MAIN CONTENT */}
        <main>
          {loading && <LoadingSkeleton count={8} />}
          {error && <div className="py-4 text-center text-red-400">{error}</div>}

          {!loading && !recipes?.length && (
            <div className="py-8 text-center text-gray-400">
              No recipes found. Try{' '}
              <button onClick={() => doSearch('chicken')} className="underline text-pink-400">
                chicken
              </button>
              ,{' '}
              <button onClick={() => doSearch('tomato')} className="underline text-pink-400">
                tomato
              </button>
              , or use Random 🍛.
            </div>
          )}

          {!loading && recipes?.length > 0 && (
            <RecipeGrid
              recipes={recipes}
              onOpen={openDetail}
              favorites={favorites}
              toggleFav={(meal) => toggleFav(meal)}
              userRatings={userRatings}
            />
          )}

          <Favorites
            items={favorites}
            onOpen={openDetail}
            onRemove={removeFav}
            userRatings={userRatings}
          />
        </main>

        {/* MODAL */}
        {selectedId && (
          <RecipeDetailModal
            id={selectedId}
            onClose={closeDetail}
            onToggleFav={(meal) => toggleFav(meal)}
            isFav={favorites.some((f) => String(f.idMeal) === String(selectedId))}
            onUserRate={handleUserRatingChange}
            userRating={userRatings[String(selectedId)] ?? null}
          />
        )}

        {/* FOOTER */}
        <footer className="mt-12">
          <div className="app-footer bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 p-6 text-center text-gray-300">
            <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Dishcovery
            </h4>
            <p>Find meals from what you already have. Fast, fresh, friendly.</p>
            <div className="mt-2 flex justify-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-pink-400">About</a>
              <a href="#" className="hover:text-pink-400">Docs</a>
              <a href="#" className="hover:text-pink-400">GitHub</a>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              © {new Date().getFullYear()} Dishcovery — Powered by 🍳 TheMealDB
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
