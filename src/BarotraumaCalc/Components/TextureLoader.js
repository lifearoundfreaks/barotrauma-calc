import gameData from "../parsed_data.json"

const convertToPxString = (...dimentions) => dimentions.map(
    value => parseFloat(value) ? `${value}px` : value
).join(" ")

const sourcerectToObj = dimentions => {
    let [X, Y, width, height] = dimentions.split(",").map(parseFloat)
    return {X, Y, width, height, size: Math.max(width, height)}
}

export default function TextureLoader(props) {
    let {size, file, sourcerect, margin, offsetMargin, ...arbitrary} = props
    let rect = sourcerectToObj(sourcerect)
    let scaleFactor = (size - margin) / rect.size
    return <div
        style={{
            width: convertToPxString(rect.width * scaleFactor),
            height: convertToPxString(rect.height * scaleFactor),
            backgroundPosition: convertToPxString(-rect.X * scaleFactor, -rect.Y * scaleFactor),
            backgroundImage: `url(${process.env.PUBLIC_URL}/tilesets/${file})`,
            backgroundSize: convertToPxString(
                ...gameData.textures[file].map(value => value * scaleFactor)
            ),
            float: "left",
            margin: convertToPxString(
                (offsetMargin || 0) + margin + (rect.size - rect.height) * scaleFactor / 2,
                (offsetMargin || 0) + margin + (rect.size - rect.width) * scaleFactor / 2
            ),
            ...arbitrary,
        }}
    />
}