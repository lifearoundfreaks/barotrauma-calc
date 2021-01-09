import TextureLoader from '../Components/TextureLoader'
import useGetParams from '../Hooks/useGetParams'

export default function ClickableItem(props) {

    const pushGetParams = useGetParams()[1]

    const handleClick = () => {
        pushGetParams({ identifier: props.identifier })
    }

    return <div
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
    >
        <TextureLoader
            size={60}
            file={props.item.texture}
            sourcerect={props.item.sourcerect}
            margin={0}
        />
    </div>
}