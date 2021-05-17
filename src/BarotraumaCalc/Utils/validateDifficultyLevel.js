import { DEFAULT_DIFFICULTY } from '../globals'

export default function validateDifficultyLevel (input) {
    return Math.max(Math.min(parseInt(input) || DEFAULT_DIFFICULTY, 100), 0)
}
