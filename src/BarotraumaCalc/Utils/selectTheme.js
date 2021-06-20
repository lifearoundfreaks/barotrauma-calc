
export const OPTION_HEIGHT = 56

export const generateStyles = (containerProvided, optionProvided) => {
    return {
        option: provided => ({
            ...provided,
            padding: (OPTION_HEIGHT - 18) / 2,
            ...optionProvided,
        }),
        control: provided => ({
            ...provided,
            borderColor: "gray",
        }),
        container: provided => ({
            ...provided,
            margin: 10,
            ...containerProvided,
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
