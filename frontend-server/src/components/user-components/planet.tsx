type PlanetProps = {
    onPlanetClick: (id:number) => void;
    id:number;
}

function Planet({id, onPlanetClick}: PlanetProps) {
    return ( 
        <button onClick={() => onPlanetClick(id)}>
            <img src="/planet-icon.svg" alt="Блок"></img>
        </button>
     );
}

export default Planet;