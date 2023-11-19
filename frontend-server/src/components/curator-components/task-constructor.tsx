import { useEffect, useState } from "react";
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

    useEffect(() => {
        
    }, [])

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
                    {constructorPlanets.map(data => <PlanetBlockConstructor key={data.id} id={data.id} currentPlanetId={data.id === currentConstructorPlanet.id} icon={"/planet-icon.svg"} type={data.name} date={data.created_at} onClickBlock={blockClickHandler} onDelete={deletePlanetHandler}/>)}
                </ul>
                <button type="submit" onClick={() => dispatch(createPlanet())}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="58" viewBox="0 0 57 58" fill="none">
                        <circle cx="28.5" cy="29" r="28.5" fill="#676767"/>
                        <path d="M28.5001 17.6L28.5001 40.4M17.1001 29H39.9001" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                    </svg>
                    <p>Добавить новый блок</p></button>
            </div>
            {currentConstructorPlanet.id !== -1 && <SelectedBlockContent numberTask={currentConstructorPlanet.task_count} personalList={personalList} idBlock={currentConstructorPlanet.id} blockName={currentConstructorPlanet.name}/>}
        </div>
    );
}

export default TaskConstructor;