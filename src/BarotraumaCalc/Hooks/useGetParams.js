import { useHistory, useLocation } from "react-router-dom"

export default function useGetParams(returnHomeLocation) {

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

    if (returnHomeLocation) {query.delete('identifier')}

    return [
        returnHomeLocation ? `/?${query.toString()}` : Object.fromEntries(query.entries()),
        useEffect
    ]
}