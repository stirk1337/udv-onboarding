type PlanetBlockProps = {
    id: string,
    icon: string,
    type: string,
    date: string,
    onClickBlock: (id: number) => void,
}

function PlanetBlockConstructor({id, icon, type, date, onClickBlock}: PlanetBlockProps) {
    return ( 
        <li onClick={() => onClickBlock(Number(id))} className="constructor-planet-list-item">
            <img src={icon} alt="" width={56} height={56}></img>
                <div className="constructor-planet-list-item-content">
                    <p>{type}</p>
                    <p className="date">{date}</p>
                </div>
            <img className="delete-icon" src="/delete-icon.svg" alt=""></img>
        </li>
    );
}

export default PlanetBlockConstructor;