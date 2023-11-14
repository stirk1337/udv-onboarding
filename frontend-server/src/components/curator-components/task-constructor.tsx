import { useState } from "react";
import { ConstructorData, PersonalData } from "../../mocks/constructor-data";
import PlanetBlockConstructor from "./planet-block-constructor";
import SelectedBlockContent from "./selected-block-content";

function TaskConstructor() {
    const [currentIdBlockConstructor, setCurrentIdBlockConstructor] = useState(-1)

    let personalList:PersonalData[] = []
    if(currentIdBlockConstructor !== -1){
        personalList = ConstructorData[currentIdBlockConstructor].personal
    }

    function blockClickHandler(id: number){
        setCurrentIdBlockConstructor(id - 1)
    }

    return ( 
        <div className="constructor-block">
            <div className="constructor-planet-list">
                <ul>
                    {ConstructorData.map(data => <PlanetBlockConstructor key={data.id} id={data.id} icon={data.icon} type={data.type} date={data.date} onClickBlock={blockClickHandler}/>)}
                </ul>
                <button type="submit"><img src="/add-icon.svg" alt=""/><p>Добавить новый блок</p></button>
            </div>
            {currentIdBlockConstructor !== -1 && <SelectedBlockContent personalList={personalList} idBlock={currentIdBlockConstructor}/>}
        </div>
    );
}

export default TaskConstructor;