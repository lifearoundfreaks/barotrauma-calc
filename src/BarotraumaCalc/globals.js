export const DEFAULT_REPUTATION = 0
export const STORE_BALANCE_MULTIPLIERS = {
    full: { value: 'full', label: 'Initial store multiplier (*100%)', numeric: 1. },
    half: { value: 'half', label: 'Below half of initial balance (*75%)', numeric: .75 },
    quarter: { value: 'quarter', label: 'Below quarter of initial balance (*20%)', numeric: .2 },
}
export const DEFAULT_STORE_BALANCE_MULTIPLIER = STORE_BALANCE_MULTIPLIERS.full
export const OUTPOST_OPTIONS = {
    city: { value: 'city', label: 'Colony' },
    outpost: { value: 'outpost', label: 'Outpost' },
    research: { value: 'research', label: 'Research' },
    military: { value: 'military', label: 'Military' },
    mine: { value: 'mine', label: 'Mine' },
}
export const DEFAULT_OUTPOST_OPTION = OUTPOST_OPTIONS.city
export const DEFAULT_SKILL_LEVEL = 20
export const FABRICATOR_OPTIONS = {
    all: { value: 'all', label: 'All' },
    fabricator: { value: 'fabricator', label: 'Fabricator' },
    medicalfabricator: { value: 'medicalfabricator', label: 'Medical Fabricator' },
}
export const DEFAULT_FABRICATOR_OPTION = FABRICATOR_OPTIONS.all
export const ENGLISH_SKILL_NAMES = {
    helm: "Helm",
    weapons: "Weapons",
    mechanical: "Mechanical Engineering",
    electrical: "Electrical Engineering",
    medical: "Medical",
    initiative: "Initiative",
    courage: "Courage",
}
export const DEFAULT_UPGRADE_LEVELS = 0
