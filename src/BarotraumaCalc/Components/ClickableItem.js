import TextureLoader from '../Components/TextureLoader'
import useGetParams from '../Hooks/useGetParams'

const getRGB = value => {
    const positive = Math.min(value > 0 ? value : 0, 200)
    const negative = Math.min(value < 0 ? -value : 0, 200)
    return `rgb(${255-positive}, ${255-negative}, ${255-negative-positive})`
}

export default function ClickableItem(props) {

    const pushGetParams = useGetParams()[1]
    const size = 60 || props.size

    const handleClick = () => {
        pushGetParams({ identifier: props.identifier })
    }

    return <div
        onClick={handleClick}
        style={{ cursor: 'pointer', height: size, backgroundColor: props.rating && getRGB(props.rating)}}
    >
        <TextureLoader
            size={size}
            file={props.item.texture}
            sourcerect={props.item.sourcerect}
            margin={0}
        />
    </div>
}