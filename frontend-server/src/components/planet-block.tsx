import Planet from "./planet";

type PlanetBlockProps = {
    onPlanetClick: (id:number) => void;
    id: string;
}

function PlanetBlock({id, onPlanetClick}: PlanetBlockProps) {
    return ( 
        <div>
            <Planet id={id} onPlanetClick={onPlanetClick}/>
        </div>
     );
}

export default PlanetBlock;