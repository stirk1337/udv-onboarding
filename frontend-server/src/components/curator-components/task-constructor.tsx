import { useState } from "react";
import PlanetBlockConstructor from "./planet-block-constructor";
import SelectedBlockContent from "./selected-block-content";
import { useAppSelector } from "../hooks";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { deletePlanet } from "../store/api-actions/delete-action";
import { getPlanet } from "../store/api-actions/get-actions";
import { createPlanet } from "../store/api-actions/post-actions";

function TaskConstructor() {
    const constructorPlanets = useAppSelector((state) => state.planets);
    const currentConstructorPlanet = useAppSelector((state) => state.currentPlanet);
    const dispatch = useDispatch<AppDispatch>()

    let personalList = currentConstructorPlanet.employees

    function blockClickHandler(evt: React.MouseEvent<HTMLLIElement>,id: number) {
        const element = (evt.target as Element).classList.value
        if(element !== 'delete-icon'){
            dispatch(getPlanet(id))
        }
    }

    function deletePlanetHandler(id: number){
        dispatch(deletePlanet(id))
    }

    return ( 
        <div className="constructor-block">
            <div className="constructor-planet-list">
                <ul>
                    {constructorPlanets.map(data => <PlanetBlockConstructor key={data.id} id={data.id} icon={"/planet-icon.svg"} type={data.name} date={data.created_at} onClickBlock={blockClickHandler} onDelete={deletePlanetHandler}/>)}
                </ul>
                <button type="submit" onClick={() => dispatch(createPlanet())}><img src="/add-icon.svg" alt=""/><p>Добавить новый блок</p></button>
            </div>
            {currentConstructorPlanet.id !== -1 && <SelectedBlockContent numberTask={currentConstructorPlanet.tasks ? currentConstructorPlanet.tasks.length: 0} personalList={personalList} idBlock={currentConstructorPlanet.id} blockName={currentConstructorPlanet.name}/>}
        </div>
    );
}

export default TaskConstructor;