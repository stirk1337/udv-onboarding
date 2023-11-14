import { useState } from "react";
import PlanetBlock from "./planet-block";
import TaskBlock from "./task-block";
import { BlockData } from "../../mocks/planet"
import { useNavigate } from "react-router-dom";


function Content() {
    const navigate = useNavigate();

    function PlanetClickHandler(id: number){
        let task = BlockData[id - 1].tasks.find(task => task.completed === false)
        if(task === undefined){
            task = BlockData[id - 1].tasks[0]
        }
        navigate(`${id - 1}/${Number(task.id) - 1}`)
    }

    return ( 
        <main>
            {BlockData.map((block) => <PlanetBlock key={block.id} id={block.id} onPlanetClick={PlanetClickHandler}/>)}
        </main>
     );
}

export default Content;