const TEXTURE_DIMENTIONS = {
    "AlienArtifact1.png": [512, 512],
    "AlienMaterials.png": [512, 512],
    "AlienPowerCell.png": [128, 128],
    "alientools.png": [128, 128],
    "button.png": [128, 128],
    "containers.png": [1024, 1024],
    "CreatureLoot.png": [512, 256],
    "GrowablePlants_Temp.png": [1024, 1024],
    "InventoryIconAtlas.png": [1024, 1024],
    "InventoryIconAtlas2.png": [512, 512],
    "LootablePlants.png": [256, 512],
    "Medicines.png": [512, 512],
    "pets.png": [512, 512],
    "weapons_new.png": [512, 512],
}

const convertToPxString = (...dimentions) => dimentions.map(
    value => parseFloat(value) ? `${value}px` : value
).join(" ")

const sourcerectToObj = dimentions => {
    let [X, Y, width, height] = dimentions.split(",").map(parseFloat)
    return {X, Y, width, height, size: Math.max(width, height)}
}

export default function TextureLoader(props) {
    let {size, file, sourcerect, margin, ...arbitrary} = props
    let rect = sourcerectToObj(sourcerect)
    let scaleFactor = (size - margin) / rect.size
    return <div
        style={{
            width: convertToPxString(rect.width * scaleFactor),
            height: convertToPxString(rect.height * scaleFactor),
            backgroundPosition: convertToPxString(-rect.X * scaleFactor, -rect.Y * scaleFactor),
            backgroundImage: `url(${process.env.PUBLIC_URL}/tilesets/${file})`,
            backgroundSize: convertToPxString(
                ...TEXTURE_DIMENTIONS[file].map(value => value * scaleFactor)
            ),
            float: "left",
            margin: convertToPxString(
                margin + (rect.size - rect.height) * scaleFactor / 2,
                margin + (rect.size - rect.width) * scaleFactor / 2
            ),
            ...arbitrary,
        }}
    />
}