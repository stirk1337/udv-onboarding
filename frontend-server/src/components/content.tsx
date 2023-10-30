import { useState } from "react";
import PlanetBlock from "./planet-block";
import ProfileButtons from "./profile-buttons";
import UsefulLinks from "./useful-links";
import GroupTable from "./group-table";
import TaskBlock from "./task-block";
import { BlockData } from "../mocks/planet"

type ContentProps = {
    isVisibleProfileButtons: boolean;
}


function Content({isVisibleProfileButtons}: ContentProps) {
    const [isVisibleUsefulLinks, setVisibleUsefulLinks] = useState(false)
    const [isVisibleGroupTable, seVisibleGroupTable] = useState(false)
    const [currentIdBlock, setCurrentIdBlock] = useState(-1)

    function linksClickHandler(){
        setVisibleUsefulLinks(!isVisibleUsefulLinks); 
    }

    function GroupTableClickHandler(){
        seVisibleGroupTable(!isVisibleGroupTable);
    }

    function PlanetClickHandler(id: number){
        setCurrentIdBlock(id - 1)
    }

    return ( 
        <main>
            {isVisibleProfileButtons && <ProfileButtons onClickLinks={linksClickHandler} onClickGroupTable={GroupTableClickHandler}/>}
            {isVisibleUsefulLinks && <UsefulLinks/>}
            {isVisibleGroupTable && <GroupTable/>}

            {BlockData.map((block) => <PlanetBlock key={block.id} id={block.id} onPlanetClick={PlanetClickHandler}/>)}
            {currentIdBlock !== -1 && <TaskBlock currentIdBlock={currentIdBlock}/>}
        </main>
     );
}

export default Content;