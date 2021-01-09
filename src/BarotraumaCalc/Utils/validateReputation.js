import { DEFAULT_REPUTATION } from '../globals'

export default function validateReputation (input) {
    return Math.max(Math.min(parseInt(input) || DEFAULT_REPUTATION, 100), -100)
}
