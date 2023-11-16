import Planet from "./planet";

type PlanetBlockProps = {
    onPlanetClick: (id:number) => void;
    id: number;
}

function PlanetBlock({id, onPlanetClick}: PlanetBlockProps) {
    return ( 
        <div className="planet">
            <Planet id={id} onPlanetClick={onPlanetClick}/>
        </div>
     );
}

export default PlanetBlock;