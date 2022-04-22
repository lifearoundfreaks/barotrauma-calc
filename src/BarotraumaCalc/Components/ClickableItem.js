import TextureLoader from '../Components/TextureLoader'
import useGetParams from '../Hooks/useGetParams'
import { Link } from 'react-router-dom'
import getRGB from '../Utils/getRGB'
import { ReactComponent as LockSVG } from '../lock.svg'

export default function ClickableItem(props) {

    const getParams = useGetParams()[0]
    const size = 60 || props.size

    const getLink = () => {
        let newParams = { ...getParams, identifier: props.identifier }
        return '/?' + Object.keys(newParams).map(key => key + '=' + newParams[key]).join('&');
    }

    return <Link
        to={getLink()}
    >
        <div style={{ backgroundColor: props.rating && getRGB(props.rating), height: size }}>
            <TextureLoader
                size={size}
                file={props.item.texture}
                sourcerect={props.item.sourcerect}
                margin={0}
            />
            {props.item.requiresrecipe && <LockSVG className='locked-recipe-craftable' />}
        </div>
    </Link>
}