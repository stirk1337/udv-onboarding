
type ListBlockProps = {
    id: string,
    name: string,
    completed: boolean,
}


function ListBlock({id, name, completed}:ListBlockProps) {
    return ( 
        <li className="list-block-item">
            <p>{name}</p>
            {completed && <img className="completed-icon" src="/completed-icon.svg" alt=""></img>}
        </li>
     );
}

export default ListBlock;