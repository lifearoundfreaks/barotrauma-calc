export default function DefaultPage(props) {
    return <>
        {props.children}
        <h5 className="mb-4">What I currently plan on adding</h5>
        <p>At the moment it is assumed in the fabrication times that you have exactly the amount of skill needed. I need to add the ability to choose skill levels since they influence the crafting times.</p>
        <p>Make items in the "Used in" and "Scrapped from" blocks color coded to indicate which related crafts of the item are profitable.</p>
        <p>Swap button for outosts.</p>
        <p>Main page item filtration.</p>
    </>
}
