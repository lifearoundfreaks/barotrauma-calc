import { DEFAULT_UPGRADE_LEVELS } from '../globals'

export default function validateReputation (input) {
    return Math.max(Math.min(parseInt(input) || DEFAULT_UPGRADE_LEVELS, 10), 0)
}
