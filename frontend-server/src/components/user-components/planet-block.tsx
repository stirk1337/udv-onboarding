
import { Planet } from "../../types";
import PlanetComponent from "./planet";

type PlanetBlockProps = {
    onPlanetClick: (id: Planet) => void;
    planet: Planet
}

function PlanetBlock({planet, onPlanetClick}: PlanetBlockProps) {
    return ( 
        <>
            <div className="planet">
                <PlanetComponent planet={planet} onPlanetClick={onPlanetClick}/>
                <div className="comets">
                    <img src="/comets.svg" alt=""></img>
                </div>
            </div>
        </>
     );
}

export default PlanetBlock;