import { useState, useEffect } from 'react';

import { supabase } from "~core/store"

import { useGroups, useChannels } from '~core/store';

export interface GroupType {
  created_at: string
  icon: string
  id: number
  name: string
  user_id: string
}

export type GroupTypes = "groups" | "channels"

export const useSupabase = (groupType: GroupTypes, filter = null, renderControl = null) => {
  const groupTypes = {
    "groups": useGroups,
    "channels": useChannels
  }

  const group = groupTypes[groupType]();
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (
      async () => {
        try {
          setLoading(true);

          let query = supabase
            .from(groupType)
            .select()

          if (filter) {
            { query = query.eq(filter[0], filter[1]) }
          }

          const { data, error } = await query

          group.create(data)
        } catch (err) {
          setError(err)
        } finally {
          setLoading(false)
        }
      }
    )()
  }, [renderControl])

  return { data: group.items, error, loading }
}