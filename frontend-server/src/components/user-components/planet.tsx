type PlanetProps = {
    onPlanetClick: (id:number) => void;
    id:number;
    image: string;
}

function Planet({id, image, onPlanetClick}: PlanetProps) {
    return ( 
        <button onClick={() => onPlanetClick(id)}>
            <img src={`/planet-gif/${image}.gif`} alt="Блок"></img>
        </button>
     );
}

export default Planet;