
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import TaskConstructorTasks from './task-constructor-tasks';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getPlanet, getPlanetCuratorTasks } from '../store/api-actions/get-actions';
import { deleteTask } from '../store/api-actions/delete-action';
import { changeTaskPosition, updateTask } from '../store/api-actions/patch-action';
import { createTask } from '../store/api-actions/post-actions';
import { changeCurrentTask, clearCurrentTask } from '../store/action';
import { maxWeightEdit, taskNumber } from '../../const-data';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { PlanetTask } from '../../types';

function TaskEditor() {
    const bottomEl = useRef<null | HTMLDivElement>(null)
    const inputRef = useRef<null | HTMLInputElement>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {id} = useParams()
    if(!Number(id) && id){
      navigate('/not-found')
    }
    const [description, setDescription] = useState('');
    const tasksStore = useAppSelector((state) => state.planetTasks)
    const [tasks, setTasks] = useState<PlanetTask[]>(tasksStore)
    const currentTaskStore = useAppSelector((state) => state.currentTask)
    const [currentTask, setCurrentTask] = useState(currentTaskStore);
    const [name, setName] = useState('');
    const [isClicked , setIsClicked] = useState(false)
    const [errorMessage, setErrorMessage] = useState(`${name.length}/100`)
    const [editWeight, setEditWeight] = useState(countWeight(description.length))

    useEffect(() => {
      dispatch(clearCurrentTask())
      if(id){
        dispatch(getPlanetCuratorTasks(Number(id)))
        setDescription(currentTask ? currentTask.description : '')
      }
    }, [])

    useEffect(() => {
      setTasks(tasksStore)
  }, [tasksStore])

  useEffect(() => {
    setCurrentTask(currentTaskStore)
}, [currentTaskStore])

    useEffect(() => {
      if(isClicked){
          const lastChildElement = bottomEl.current?.lastElementChild;
          lastChildElement?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
          setIsClicked(false)
      }
  }, [tasks])

    useEffect(() => {
      setName(currentTask.name ? currentTask.name : '')
      setDescription(currentTask ? currentTask.description : '')
      setErrorMessage(`${currentTask.name.length}/100`)
      setEditWeight(countWeight(currentTask.description.length))
    }, [currentTask])

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
        inputRef.current?.blur()
        if(currentTaskStore.id !== -1){
          onBlurHandler()
        }
      }
    }

    function countWeight(length: number){
      return Math.round(length / maxWeightEdit * 100)
    }

    function getSmileByWeight(weight: number){
      if(weight >= 100) { return 128555 }
      else if (weight >= 75) { return 128552 }
      else if (weight >= 50) { return 128528 }
      else if(weight >= 25) { return 128512 }
      else { return 128516 }
    }

  function deleteTaskHandler(taskId: number){
    dispatch(deleteTask({planetId: Number(id), taskId: taskId}))
    dispatch(clearCurrentTask())
  }

  function onChangeNameHandler(evt: ChangeEvent<HTMLInputElement>){
    const name = evt.target.value
    const nameLength = name.length > 999 ? '999+' : name.length
    setName(name);
    setErrorMessage(`${nameLength}/100`)
  } 

  function onChangeDescriptionHandler(value: string) {
    setDescription(value)
    setEditWeight((countWeight(value.length)))
  }

  function onBlurHandler(){
    if(name.length <= 100 && name.length !== 0 && description.length < maxWeightEdit){
      dispatch(updateTask({name: name, description: description, taskId: currentTask.id}))
    }
  }

  function onClickAddRask(){
    setIsClicked(true)
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
                <div ref={bottomEl} className="constructor-task-list-block">
                  <Droppable droppableId={'1'}>
                    {(provided) => (
                      <>
                        <ul
                          ref={provided.innerRef} 
                          {...provided.droppableProps}>
                            {tasks.map((task, index) => <TaskConstructorTasks index={index} key={task.id} currentTaskId={task.id === currentTask.id} taskId={task.id} blockId={task.planet_id} icon={task.image} name={task.name} date={task.created_at} onClickElement={constructorClickHandler} onDelete={deleteTaskHandler}/>)}
                          {provided.placeholder}
                        </ul>
                      </>
                    )}
                  </Droppable>
                </div>
                <button className='new-task-button' type="submit" onClick={onClickAddRask}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="57" height="58" viewBox="0 0 57 58" fill="none">
                    <circle cx="28.5" cy="29" r="28.5" fill="#676767"/>
                    <path d="M28.5001 17.6L28.5001 40.4M17.1001 29H39.9001" stroke="white" stroke-width="5" stroke-linecap="round"/>
                  </svg>Добавить новый этап
                </button>
              </DragDropContext>
            </div>
            {currentTask.id !== -1 && <div className='edit-content'>
              <div className='selected-task-input'>
                <input ref={inputRef} className="selected-block-name" value={name} onChange={onChangeNameHandler} placeholder="Введите название этапа" onBlur={onBlurHandler}></input>
                <span className={name.length > 100 || name.length === 0 ? `error-message` : 'message'}>{errorMessage}</span>
              </div>
              <div className='quill-block' onBlur={onBlurHandler}>
                <ReactQuill theme="snow" value={description} onChange={onChangeDescriptionHandler} modules={modules} />
              </div>
              <div className='weight-edit-data'>
                <span className={editWeight >= 100 ? `error-message` : 'edit-message'}>{editWeight}% {String.fromCodePoint(getSmileByWeight(editWeight))}</span>
              </div>
            </div>}
        </div>
     );
}

export default TaskEditor;