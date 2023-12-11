import Planet from "./planet";

type PlanetBlockProps = {
    onPlanetClick: (id:number) => void;
    id: number;
    image: string;
}

function PlanetBlock({id, image, onPlanetClick}: PlanetBlockProps) {
    return ( 
        <div className="planet">
            <Planet id={id} image={image} onPlanetClick={onPlanetClick}/>
        </div>
     );
}

export default PlanetBlock;