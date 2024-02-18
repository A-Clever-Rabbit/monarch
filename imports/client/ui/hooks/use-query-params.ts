import {useLocation} from 'react-router-dom'
import {useMemo} from 'react'

export function useQueryParams<T>() {
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search])
  return Object.fromEntries(searchParams.entries()) as Partial<T>;
}
