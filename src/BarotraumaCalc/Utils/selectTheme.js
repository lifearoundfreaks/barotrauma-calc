
export const OPTION_HEIGHT = 56

export const generateStyles = (customProvided) => {
    return {
        option: (provided, state) => ({
            ...provided,
            padding: (OPTION_HEIGHT - 18) / 2,
        }),
        container: (provided, state) => ({
            ...provided,
            margin: 10,
            ...customProvided,
        })
    }
}

export const customThemeOverrides = theme => ({
    ...theme,
    borderRadius: 0,
    colors: {
        ...theme.colors,
        primary: 'darkgray',
        primary25: 'lightgray',
        primary50: 'gray',
    },
})
