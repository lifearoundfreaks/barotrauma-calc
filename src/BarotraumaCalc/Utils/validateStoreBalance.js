import { STORE_BALANCE_MULTIPLIERS, DEFAULT_STORE_BALANCE_MULTIPLIER } from '../globals'

export default function validateStoreBalance (input) {
    return STORE_BALANCE_MULTIPLIERS[input] || DEFAULT_STORE_BALANCE_MULTIPLIER
}
