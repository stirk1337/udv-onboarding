import PlanetBlock from "./planet-block";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getPlanetTasks } from "../store/api-actions/get-actions";


function Content() {
    const dispatch = useAppDispatch()
    const blockData = useAppSelector((state) => state.planets);

    function PlanetClickHandler(id: number){
        dispatch(getPlanetTasks(id))
    }

    return ( 
        <main>
            {blockData.map((block) => <PlanetBlock key={block.id} image={block.image} id={block.id} onPlanetClick={PlanetClickHandler}/>)}
        </main>
     );
}

export default Content;