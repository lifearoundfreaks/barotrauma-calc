import { FABRICATOR_OPTIONS, DEFAULT_FABRICATOR_OPTION } from '../globals'

export default function validateFabricator (input) {
    return FABRICATOR_OPTIONS[input] || DEFAULT_FABRICATOR_OPTION
}
