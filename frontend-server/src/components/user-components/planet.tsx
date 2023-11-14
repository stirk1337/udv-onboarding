type PlanetProps = {
    onPlanetClick: (id:number) => void;
    id:string;
}

function Planet({id, onPlanetClick}: PlanetProps) {
    return ( 
        <button onClick={() => onPlanetClick(Number(id))}>
            <img src="/planet-icon.svg" alt="Блок"></img>
        </button>
     );
}

export default Planet;