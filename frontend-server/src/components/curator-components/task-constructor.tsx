import { useEffect, useRef, useState } from "react";
import PlanetBlockConstructor from "./planet-block-constructor";
import SelectedBlockContent from "./selected-block-content";
import { useAppSelector } from "../hooks";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { deletePlanet } from "../store/api-actions/delete-action";
import { getPlanet } from "../store/api-actions/get-actions";
import { createPlanet } from "../store/api-actions/post-actions";
import { planetNumber } from "../../const-data";
import { DragDropContext, Droppable} from 'react-beautiful-dnd'
import { changePlanerPosition } from "../store/api-actions/patch-action";
import { Planet } from "../../types";
import { clearCurrentPlanet } from "../store/action";

function TaskConstructor() {
    const bottomEl = useRef<null | HTMLDivElement>(null)
    const inputRef = useRef<null | HTMLInputElement>(null)
    const planets = useAppSelector((state) => state.planets)
    const [constructorPlanets, setConstructedPlanets] = useState<Planet[]>(planets)
    const currentConstructorPlanet = useAppSelector((state) => state.currentPlanet);
    const dispatch = useDispatch<AppDispatch>()
    let personalList = currentConstructorPlanet.employees
    const [isClicked , setIsClicked] = useState(false)

    useEffect(() => {
        dispatch(clearCurrentPlanet())
    }, [])

    useEffect(() => {
        setConstructedPlanets(planets)
    }, [planets])

    useEffect(() => {
        if(isClicked){
            const lastChildElement = bottomEl.current?.lastElementChild;
            lastChildElement?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
            setIsClicked(false)
        }
    }, [constructorPlanets])

    function blockClickHandler(evt: React.MouseEvent<HTMLLIElement>,id: number) {
        const element = (evt.target as Element).classList.value
        if(element !== 'delete-icon'){
            dispatch(getPlanet(id))
            inputRef.current?.blur()
        }
    }

    function deletePlanetHandler(id: number){
        dispatch(deletePlanet(id))
    }

    function onClickAddPlaner(){
        setIsClicked(true)
        if(constructorPlanets.length === 0){
            dispatch(createPlanet(1))
            return
        }
        const lastPlanet = constructorPlanets[constructorPlanets.length - 1].image
        const iconId = Number(lastPlanet.split('planet')[1])
        if(iconId === planetNumber){
            dispatch(createPlanet(1))
        }
        else{
            dispatch(createPlanet(iconId + 1))
        }
    }

    function onDragEnd(result: { destination: any; source: any; draggableId: any; }){
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
          }
      
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return;
          }

          const array = [...constructorPlanets]
          const element = array[source.index]
          array.splice(source.index, 1)
          array.splice(destination.index, 0, element)
          setConstructedPlanets(array)
          
        dispatch(changePlanerPosition({planetId: draggableId, position: destination.index}))
    };
    

    return ( 
        <div className="constructor-block">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="constructor-planet-list">
                    <div ref={bottomEl} className="constructor-planet-list-block">
                        <Droppable droppableId={'1'}>
                            {(provided) => (
                                <>
                                    <ul
                                        ref={provided.innerRef} 
                                        {...provided.droppableProps}>
                                            {constructorPlanets.map((data, index) => <PlanetBlockConstructor index={index} key={data.id} id={data.id} currentPlanetId={data.id === currentConstructorPlanet.id} icon={data.image} type={data.name} date={data.created_at} onClickBlock={blockClickHandler} onDelete={deletePlanetHandler}/>)}
                                        {provided.placeholder}
                                    </ul>
                                </>
                            )}
                        </Droppable>
                    </div>
                    <button type="submit" onClick={onClickAddPlaner}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="57" height="58" viewBox="0 0 57 58" fill="none">
                            <circle cx="28.5" cy="29" r="28.5" fill="#676767"/>
                            <path d="M28.5001 17.6L28.5001 40.4M17.1001 29H39.9001" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                        </svg>
                        <p>Добавить новый блок</p></button>
                </div>
            </DragDropContext>
            {currentConstructorPlanet.id !== -1 && <SelectedBlockContent inputRef={inputRef} numberTask={currentConstructorPlanet.task_count} personalList={personalList} idBlock={currentConstructorPlanet.id} blockName={currentConstructorPlanet.name}/>}
        </div>
    );
}

export default TaskConstructor;