// src/utils/debounce.js
export function debounce(fn, ms = 350) {
  let t = null
  function wrapped(...args) {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
  wrapped.cancel = () => {
    if (t) {
      clearTimeout(t)
      t = null
    }
  }
  return wrapped
}
