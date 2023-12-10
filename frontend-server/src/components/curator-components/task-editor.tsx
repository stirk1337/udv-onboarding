
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import TaskConstructorTasks from './task-constructor-tasks';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getPlanet, getPlanetCuratorTasks, getPlanetTasks, getPlanets } from '../store/api-actions/get-actions';
import { deleteTask } from '../store/api-actions/delete-action';
import { changeTaskPosition, updateTask } from '../store/api-actions/patch-action';
import { createTask } from '../store/api-actions/post-actions';
import { changeCurrentTask, clearCurrentPlanet, clearCurrentTask } from '../store/action';
import { taskNumber } from '../../const-data';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { PlanetTask } from '../../types';

function TaskEditor() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const [description, setDescription] = useState('');
    const tasksStore = useAppSelector((state) => state.planetTasks)
    const [tasks, setTasks] = useState<PlanetTask[]>(tasksStore)
    const currentTask = useAppSelector((state) => state.currentTask);
    console.log(tasks);
    const [name, setName] = useState('');

    useEffect(() => {
      if(id){
        dispatch(getPlanetCuratorTasks(Number(id)))
        setDescription(currentTask ? currentTask.description : '')
      }
    }, [])

    useEffect(() => {
      setTasks(tasksStore)
  }, [tasksStore])

    useEffect(() => {
      setName(currentTask.name ? currentTask.name : '')
      setDescription(currentTask ? currentTask.description : '')
    }, [currentTask])

    const navigate = useNavigate()
    const modules = {
        toolbar: [
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline','strike'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link', 'image', 'video'],
          [{'align': ['right','center', false]}],
          ['clean']
        ],
      }
      
    function constructorClickHandler(evt: React.MouseEvent<HTMLLIElement>, id: number){
      const element = (evt.target as Element).classList.value
      if(element !== 'delete-icon'){
        dispatch(changeCurrentTask(tasks.find((task) => task.id === id) || tasks[0]))
      }
    }

  function deleteTaskHandler(taskId: number){
    dispatch(deleteTask({planetId: Number(id), taskId: taskId}))
    dispatch(clearCurrentTask())
  }

  function onChangeNameHandler(evt: ChangeEvent<HTMLInputElement>){
    setName(evt.target.value)
  } 

  function onChangeDescriptionHandler(value: string) {
    console.log(value)
    setDescription(value)
  }

  function onBlurHandler(){
    dispatch(updateTask({name: name, description: description, taskId: currentTask.id}))
  }

  function onClickAddRask(){
    if(tasks.length === 0){
      dispatch(createTask({id: Number(id), imageId: 1}))
        return
    }
    const lastPlanet = tasks[tasks.length - 1].image
    const iconId = Number(lastPlanet[lastPlanet.length - 1])
    if(iconId === taskNumber){
      dispatch(createTask({id: Number(id), imageId: 1}))
    }
    else{
      dispatch(createTask({id: Number(id), imageId: iconId + 1}))
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

        const array = [...tasks]
        console.log(array)
        const element = array[source.index]
        array.splice(source.index, 1)
        array.splice(destination.index, 0, element)
        setTasks(array)
        dispatch(changeTaskPosition({taskId: draggableId, position: destination.index}))
    };
    
    return ( 
        <div className='task-edit-block'>
            <div className="selected-block-monster-list">
              <div className="monster-header">
                <button onClick={() => {dispatch(getPlanet(Number(id))),dispatch(clearCurrentTask()), navigate('/curator')}}>
                  <p><img src="/back-arrow.svg" alt=""></img> Вернуться к блокам</p>
                </button>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={'1'}>
                  {(provided) => (
                    <ul
                    ref={provided.innerRef} 
                    {...provided.droppableProps}>
                      {tasks.map((task, index) => <TaskConstructorTasks index={index} key={task.id} currentTaskId={task.id === currentTask.id} taskId={task.id} blockId={task.planet_id} icon={task.image} name={task.name} date={task.created_at} onClickElement={constructorClickHandler} onDelete={deleteTaskHandler}/>)}
                    {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              <button className='new-task-button' type="submit" onClick={onClickAddRask}>
                <svg xmlns="http://www.w3.org/2000/svg" width="57" height="58" viewBox="0 0 57 58" fill="none">
                  <circle cx="28.5" cy="29" r="28.5" fill="#676767"/>
                  <path d="M28.5001 17.6L28.5001 40.4M17.1001 29H39.9001" stroke="white" stroke-width="5" stroke-linecap="round"/>
                </svg>Добавить новый этап
              </button>
            </div>
            {currentTask.id !== -1 && <div className='edit-content'>
              <input className="selected-block-name" value={name} onChange={onChangeNameHandler} placeholder="Введите название этапа" onBlur={onBlurHandler}></input>
              <ReactQuill theme="snow" value={description} onChange={onChangeDescriptionHandler} modules={modules} onBlur={onBlurHandler} />
            </div>}
        </div>
     );
}

export default TaskEditor;