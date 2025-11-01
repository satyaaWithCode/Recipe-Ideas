



// src/components/RecipeGrid.jsx
import React from 'react'
import RecipeCard from './RecipeCard'

export default function RecipeGrid({ recipes = [], onOpen, favorites = [], toggleFav, userRatings = {} }) {
  if (!recipes || recipes.length === 0) {
    return <div className="p-8 text-center text-gray-500">No recipes found. Try another ingredient or remove filters.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((r) => {
        // r is canonical: { idMeal, strMeal, strMealThumb }
        const id = String(r.idMeal)
        const meal = { idMeal: id, strMeal: r.strMeal, strMealThumb: r.strMealThumb }
        const isFav = favorites.some(f => String(f.idMeal) === id)
        const userRating = userRatings[String(id)] ?? null
        return (
          <RecipeCard
            key={String(id)}
            meal={meal}
            onOpen={() => onOpen(String(id))}
            onToggleFav={() => toggleFav(meal)}
            isFav={isFav}
            userRating={userRating}
          />
        )
      })}
    </div>
  )
}
