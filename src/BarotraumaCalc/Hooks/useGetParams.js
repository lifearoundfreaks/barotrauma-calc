import { useHistory, useLocation } from "react-router-dom"

export default function useGetParams(useRawQuery) {

    const location = useLocation()
    const history = useHistory()
    const query = new URLSearchParams(location.search);

    const useEffect = (newValues) => {
        for (const [key, value] of Object.entries(newValues)){
            if (value === undefined) query.delete(key)
            else query.set(key, value)
        }
        history.push(`/?${query.toString()}`)
    }

    return [
        useRawQuery ? `/?${query.toString()}` : Object.fromEntries(query.entries()),
        useEffect
    ]
}