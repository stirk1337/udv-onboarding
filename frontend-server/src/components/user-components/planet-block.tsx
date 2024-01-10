
import { bigPlanets } from "../../const-data";
import { Planet } from "../../types";
import PlanetComponent from "./planet";

type PlanetBlockProps = {
    onPlanetClick: (id: Planet) => void;
    planet: Planet
}

function PlanetBlock({planet, onPlanetClick}: PlanetBlockProps) {
    return ( 
        <>
            <div className={bigPlanets.includes(planet.image.split('planet')[1]) ? 'planet big-planet' : 'planet'}>
                <p>{planet.name}</p>
                <PlanetComponent planet={planet} onPlanetClick={onPlanetClick}/>
                <div className="comets">
                    <img src="/comets.svg" alt=""></img>
                </div>
            </div>
        </>
     );
}

export default PlanetBlock;