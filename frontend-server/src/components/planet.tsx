type PlanetProps = {
    onPlanetClick: (id:number) => void;
    id:string;
}

function Planet({id, onPlanetClick}: PlanetProps) {
    return ( 
        <button onClick={() => onPlanetClick(Number(id))}>
            <img src="" alt="Блок" width={182} height={181}></img>
        </button>
     );
}

export default Planet;