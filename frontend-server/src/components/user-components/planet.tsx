import { bigPlanets } from "../../const-data";
import { Planet } from "../../types";

type PlanetProps = {
    onPlanetClick: (id: Planet) => void;
    planet: Planet
}

function PlanetComponent({planet, onPlanetClick}: PlanetProps) {
    return ( 
        <button onClick={() => onPlanetClick(planet)}>
            <img src={`/planet-gif/${planet.image}.gif`} alt="Блок"></img>
        </button>
     );
}

export default PlanetComponent;