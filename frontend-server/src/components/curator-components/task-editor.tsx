
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import TaskConstructorTasks from './task-constructor-tasks';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getPlanet, getPlanetCuratorTasks, getPlanetTasks, getPlanets } from '../store/api-actions/get-actions';
import { deleteTask } from '../store/api-actions/delete-action';
import { updateTask } from '../store/api-actions/patch-action';
import { createTask } from '../store/api-actions/post-actions';
import { changeCurrentTask, clearCurrentPlanet, clearCurrentTask } from '../store/action';

function TaskEditor() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const [description, setDescription] = useState('');
    const tasks = useAppSelector((state) => state.planetTasks);
    const currentTask = useAppSelector((state) => state.currentTask);
    console.log(currentTask);
    const [name, setName] = useState('');

    useEffect(() => {
      if(id){
        dispatch(getPlanetCuratorTasks(Number(id)))
        setDescription(currentTask ? currentTask.description : '')
      }
    }, [])

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
    
    return ( 
        <div className='task-edit-block'>
            <div className="selected-block-monster-list">
              <div className="monster-header">
                <button onClick={() => {dispatch(getPlanet(Number(id))),dispatch(clearCurrentTask()), navigate('/curator')}}>
                  <p><img src="/back-arrow.svg" alt=""></img> Вернуться к блокам</p>
                </button>
              </div>
              <ul>
                {tasks.map(task => <TaskConstructorTasks key={task.id} currentTaskId={task.id === currentTask.id} taskId={task.id} blockId={task.planet_id} icon={"/monster-icon.svg"} name={task.name} date={task.created_at} onClickElement={constructorClickHandler} onDelete={deleteTaskHandler}/>)}
              </ul>
              <button className='new-task-button' type="submit" onClick={() => dispatch(createTask(Number(id)))}>                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="58" viewBox="0 0 57 58" fill="none">
                        <circle cx="28.5" cy="29" r="28.5" fill="#676767"/>
                        <path d="M28.5001 17.6L28.5001 40.4M17.1001 29H39.9001" stroke="white" stroke-width="5" stroke-linecap="round"/>
                    </svg>Добавить новую задачу</button>
            </div>
            {currentTask.id !== -1 && <div className='edit-content'>
              <input className="selected-block-name" value={name} onChange={onChangeNameHandler} placeholder="Введите название задачи" onBlur={onBlurHandler}></input>
              <ReactQuill theme="snow" value={description} onChange={onChangeDescriptionHandler} modules={modules} onBlur={onBlurHandler} />
            </div>}
        </div>
     );
}

export default TaskEditor;