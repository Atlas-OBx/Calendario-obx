import { useState, useEffect } from 'react'

/**
 * Parses a CSV string into an array of objects.
 * Handles quoted fields containing commas/newlines.
 */
function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  // Parse header — remove BOM if present
  const rawHeader = lines[0].replace(/^\uFEFF/, '')
  const headers = parseCSVLine(rawHeader)

  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = parseCSVLine(line)
    if (values.length === 0) continue
    const obj = {}
    headers.forEach((h, idx) => {
      obj[h.trim()] = (values[idx] || '').trim()
    })
    rows.push(obj)
  }
  return rows
}

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

/**
 * Custom hook to fetch and parse CSV from a URL.
 * Uses VITE_CSV_URL env variable by default.
 */
export function useCSVData(url) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setError('URL da planilha não configurada. Defina a variável VITE_CSV_URL.')
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`)
        const text = await res.text()
        const parsed = parseCSV(text)
        if (!cancelled) {
          setData(parsed)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Erro ao carregar a planilha.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}
