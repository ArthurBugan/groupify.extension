import { useState, useEffect } from 'react';
import { useGroups, useChannels } from '~core/store';

export interface GroupType {
  created_at: string
  icon: string
  id: number
  name: string
  user_id: string
}

export type GroupTypes = "groups" | "channels"

export const useGroupifyStorage = (groupType: GroupTypes, filter = null, renderControl = null) => {
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
        if (!renderControl) {
          return;
        }

        try {
          setLoading(true);

          console.log(groupType)

          let url = `${process.env.PLASMO_PUBLIC_GROUPIFY_URL}/${groupType}`;


          if (filter) {
            url = `${url}/${filter}`
          }

          let query = await fetch(url, {
            credentials: 'include',
            method: 'GET',
            headers: {
              "Content-Type": "application/json"
            }
          });

          let groups = await query.json();

          group.create(groups);
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