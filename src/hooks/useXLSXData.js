import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

/**
 * Hook para carregar e parsear a planilha agenda.xlsx
 * localizada em /public/agenda.xlsx.
 *
 * Retorna { data, loading, error }
 * onde data é um array de objetos com as chaves:
 *   Data, Horário, Ação, Cidade, Local, Status, Descrição, Responsável
 */
export function useXLSXData(filePath = '/agenda.xlsx') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchXLSX = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(filePath)
        if (!res.ok) {
          throw new Error(
            `Não foi possível carregar a planilha (HTTP ${res.status}). ` +
            `Verifique se o arquivo agenda.xlsx está em public/`
          )
        }

        const arrayBuffer = await res.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true })

        // Usa a primeira aba da planilha
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        // Converte para array de objetos usando a primeira linha como header
        const rows = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: false, // retorna valores formatados (strings)
        })

        // Normaliza datas: se vier como objeto Date ou número serial do Excel,
        // converte para DD/MM/YYYY
        const normalized = rows.map((row) => {
          const datRaw = row['Data'] ?? row['data'] ?? ''
          let datStr = String(datRaw).trim()

          // Detecta se é uma data JS (quando cellDates:true e raw:false retorna string ISO)
          // Exemplo: "2025-06-12T03:00:00.000Z"
          if (datStr.match(/^\d{4}-\d{2}-\d{2}T/)) {
            const d = new Date(datStr)
            const day = String(d.getUTCDate()).padStart(2, '0')
            const month = String(d.getUTCMonth() + 1).padStart(2, '0')
            const year = d.getUTCFullYear()
            datStr = `${day}/${month}/${year}`
          }

          // Se vier como YYYY-MM-DD (sem hora)
          if (datStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [y, m, d] = datStr.split('-')
            datStr = `${d}/${m}/${y}`
          }

          return { ...row, Data: datStr }
        })

        if (!cancelled) {
          setData(normalized)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Erro ao carregar a planilha.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchXLSX()
    return () => { cancelled = true }
  }, [filePath])

  return { data, loading, error }
}
