import { useState, useEffect } from 'react';

import { useStorage } from "@plasmohq/storage/hook"
import { supabase } from "~core/store"

export interface GroupType {
  created_at: string
  icon: string
  id: number
  name: string
  user_id: string
}

export const useSupabase = (group, filter = null, renderControl = null) => {
  const [data, setData] = useStorage(group, [])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (
      async () => {
        try {
          setLoading(true);

          let query = supabase
            .from(group)
            .select()

          if (filter) {
            { query = query.eq(filter[0], filter[1]) }
          }

          const { data, error } = await query

          setData(data)
        } catch (err) {
          setError(err)
        } finally {
          setLoading(false)
        }
      }
    )()
  }, [renderControl])

  return { data, error, loading }
}