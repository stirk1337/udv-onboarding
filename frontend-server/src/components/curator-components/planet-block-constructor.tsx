import { Draggable } from "react-beautiful-dnd";

type PlanetBlockProps = {
    id: number,
    icon: string,
    type: string,
    date: string,
    currentPlanetId: boolean,
    onClickBlock: (evt: React.MouseEvent<HTMLLIElement>, id: number) => void,
    onDelete: (id: number) => void,
    index: number
}

function PlanetBlockConstructor({id,index, icon, type, date, currentPlanetId, onClickBlock, onDelete}: PlanetBlockProps) {
    const convertedDate = date.split('T')[0].split('-'); 
    const active = currentPlanetId && 'active'
    return ( 
        <Draggable draggableId={String(id)} index={index}>
            {(provided) => (
                <li {...provided.draggableProps}  {...provided.dragHandleProps} ref={provided.innerRef} onClick={(evt) => onClickBlock(evt, id)} className={"constructor-planet-list-item " + active}>
                    <img src={`/planet-prev/${icon}.png`} alt="" width={56} height={56}></img>
                    <div className="constructor-planet-list-item-content">
                        <p>{type}</p>
                        <p className="date">{`${convertedDate[2]}.${convertedDate[1]}.${convertedDate[0]}`}</p>
                    </div>
                    <svg className="delete-icon" onClick={() => onDelete(id)} xmlns="http://www.w3.org/2000/svg" width="33" height="37" viewBox="0 0 33 37" fill="none">
                        <path d="M12.1942 18.2222V27.6944M19.9443 18.2222V27.6945M1 8.75H32M4.44531 14.7778V29.8081C4.44531 32.921 7.04767 35.4444 10.2578 35.4444H21.8828C25.0931 35.4444 27.6953 32.921 27.6953 29.8081V14.7778M10.4718 4.875C10.4718 2.7349 12.1424 1 14.2032 1H17.9347C19.9956 1 21.6662 2.7349 21.6662 4.875V8.75H10.4718V4.875Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </li>
            )}
        </Draggable>
    );
}

export default PlanetBlockConstructor;