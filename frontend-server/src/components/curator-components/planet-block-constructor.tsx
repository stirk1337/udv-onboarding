type PlanetBlockProps = {
    id: number,
    icon: string,
    type: string,
    date: string,
    onClickBlock: (evt: React.MouseEvent<HTMLLIElement>, id: number) => void,
    onDelete: (id: number) => void,
}

function PlanetBlockConstructor({id, icon, type, date, onClickBlock, onDelete}: PlanetBlockProps) {
    const convertedDate = date.split('T')[0].split('-'); 

    return ( 
        <li onClick={(evt) => onClickBlock(evt, id)} className="constructor-planet-list-item">
            <img src={icon} alt="" width={56} height={56}></img>
                <div className="constructor-planet-list-item-content">
                    <p>{type}</p>
                    <p className="date">{`${convertedDate[2]}.${convertedDate[1]}.${convertedDate[0]}`}</p>
                </div>
            <img className="delete-icon" src="/delete-icon.svg" alt="" onClick={() => onDelete(id)}></img>
        </li>
    );
}

export default PlanetBlockConstructor;