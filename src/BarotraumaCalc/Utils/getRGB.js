export default function getRGB (value) {
    const positive = Math.min(value > 0 ? value : 0, 200)
    const negative = Math.min(value < 0 ? -value : 0, 200)
    return `rgb(${255-positive}, ${255-negative}, ${255-negative-positive})`
}
