import PlanetBlock from "./planet-block";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getPlanetTasks } from "../store/api-actions/get-actions";
import { CuratorPlanetData, Planet } from "../../types";
import { changeCurrentPlanet } from "../store/action";


function Content() {
    const dispatch = useAppDispatch()
    const blockData = useAppSelector((state) => state.planets);

    function PlanetClickHandler(planetData: Planet){
        console.log(planetData)
        dispatch(changeCurrentPlanet(planetData as CuratorPlanetData));
        dispatch(getPlanetTasks(planetData.id));
    }

    return ( 
        <main>
            {blockData.map((block) => <PlanetBlock key={block.id} planet={block} onPlanetClick={PlanetClickHandler}/>)}
        </main>
     );
}

export default Content;