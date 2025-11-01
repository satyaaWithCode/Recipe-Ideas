
// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { debounce } from '../utils/debounce'
import { FiSearch } from 'react-icons/fi'

export default function SearchBar({ onSearch, onTyping }) {
  const [value, setValue] = useState('')
  const debouncedRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    debouncedRef.current = debounce((q) => {
      if (typeof onTyping === 'function') onTyping(q)
    }, 450)
    return () => {
      if (debouncedRef.current && typeof debouncedRef.current.cancel === 'function') {
        debouncedRef.current.cancel()
      }
    }
  }, [onTyping])

  const submit = (e) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    if (debouncedRef.current) debouncedRef.current(e.target.value)
  }

  // optional: allow pressing "/" to focus search (nice UX)
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <form
      onSubmit={submit}
      className="relative w-full flex items-center bg-white/80 backdrop-blur-md border border-orange-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <span className="absolute left-4 text-orange-400 text-xl">
        <FiSearch />
      </span>

      <input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder="Search ingredients — e.g. chicken, tomato, pasta"
        className="flex-1 pl-11 pr-4 py-3 text-gray-800 placeholder-gray-400 rounded-l-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300"
        aria-label="Search ingredients"
      />

      <button
        type="submit"
        className="px-5 py-3 rounded-r-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 focus:ring-2 focus:ring-offset-1 focus:ring-orange-300 transition-all duration-300 shadow-sm"
      >
        Search
      </button>
    </form>
  )
}
