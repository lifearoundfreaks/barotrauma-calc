import { OUTPOST_OPTIONS, DEFAULT_OUTPOST_OPTION } from '../globals'

export default function validateOutpost (input) {
    return OUTPOST_OPTIONS[input] || DEFAULT_OUTPOST_OPTION
}
