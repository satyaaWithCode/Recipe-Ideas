

// src/api.js
const BASE = 'https://www.themealdb.com/api/json/v1/1'

// Normalize meal shape
function normalizeMeal(m) {
  if (!m) return null
  return {
    idMeal: m.idMeal ?? m.id ?? (m.mealId ? String(m.mealId) : undefined),
    strMeal: m.strMeal ?? m.name ?? m.title ?? '',
    strMealThumb: m.strMealThumb ?? m.thumb ?? m.image ?? '',
  }
}

/**
 * Search recipes by ingredient(s)
 */
export async function searchByIngredient(ingredient) {
  if (!ingredient || !ingredient.trim()) return []

  const parts = ingredient
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const resultsArr = await Promise.all(
    parts.map(p =>
      fetch(`${BASE}/filter.php?i=${encodeURIComponent(p)}`)
        .then(r => (r.ok ? r.json() : Promise.reject(new Error('API error'))))
        .catch(() => ({ meals: null }))
    )
  )

  const lists = resultsArr.map(r => (r.meals ? r.meals.map(m => normalizeMeal(m)) : []))

  if (lists.length === 0) return []
  if (lists.length === 1) return lists[0]

  // attempt intersection (AND)
  const idCount = {}
  lists.forEach(list => list.forEach(item => { idCount[String(item.idMeal)] = (idCount[String(item.idMeal)] || 0) + 1 }))
  const intersection = lists[0].filter(item => idCount[String(item.idMeal)] === lists.length)
  if (intersection.length > 0) return intersection

  // fallback: union (OR)
  const unionMap = {}
  lists.flat().forEach(i => { unionMap[String(i.idMeal)] = i })
  return Object.values(unionMap)
}

/**
 * Small in-memory cache for recipe details
 */
const recipeCache = {}

export async function getRecipeById(id) {
  if (!id) return null
  const key = String(id)
  if (recipeCache[key]) return recipeCache[key]
  const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error('Failed to load recipe details')
  const data = await res.json()
  const meal = data.meals?.[0] ?? null
  if (meal) recipeCache[key] = meal
  return meal
}

/**
 * Get a random recipe
 */
export async function getRandomRecipe() {
  const res = await fetch(`${BASE}/random.php`)
  if (!res.ok) throw new Error('Failed to load random recipe')
  const data = await res.json()
  const meal = data.meals?.[0] ?? null
  return meal ? normalizeMeal(meal) : null
}

/**
 * Get recipes by category
 */
export async function getRecipesByCategory(category) {
  if (!category) return []
  const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`)
  if (!res.ok) throw new Error('Failed to load category recipes')
  const data = await res.json()
  return data.meals ? data.meals.map((m) => normalizeMeal(m)) : []
}

/**
 * 🔥 NEW: search by meal name (supports partial match)
 */
export async function searchByName(name) {
  if (!name || !name.trim()) return []
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(name.trim())}`)
  if (!res.ok) throw new Error('Failed to search by name')
  const data = await res.json()
  return data.meals ? data.meals.map(m => normalizeMeal(m)) : []
}

// get recipes whose name starts with a given first letter (TheMealDB supports search.php?f=)
export async function getByFirstLetter(letter) {
  if (!letter || !letter.trim()) return [];
  const ch = String(letter).trim()[0].toLowerCase();
  const url = `${BASE}/search.php?f=${encodeURIComponent(ch)}`;
  const data = await fetch(url).then(r => r.json()).catch(() => ({ meals: null }));
  return (data.meals || []).map(m => ({
    id: m.idMeal,
    name: m.strMeal,
    thumb: m.strMealThumb
  }));
}
