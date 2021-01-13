import { DEFAULT_SKILL_LEVEL } from '../globals'

export default function validateSkill (input) {
    let parsed = parseInt(input)
    return Math.max(Math.min(isNaN(parsed) ? DEFAULT_SKILL_LEVEL : parsed, 100), 0)
}
