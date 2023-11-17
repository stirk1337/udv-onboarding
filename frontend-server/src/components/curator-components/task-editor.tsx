
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ConstructorData } from '../../mocks/constructor-data';
import { useNavigate, useParams } from 'react-router-dom';
import TaskConstructorTasks from './task-constructor-tasks';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getPlanetTasks } from '../store/api-actions/get-actions';
import { deleteTask } from '../store/api-actions/delete-action';
import { updateTask } from '../store/api-actions/patch-action';

function TaskEditor() {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const [description, setDescription] = useState('');
    const tasks = useAppSelector((state) => state.planetTasks);
    const [currentTask, setCurrentTask] =  useState(tasks[0])
    const [name, setName] = useState('');

    useEffect(() => {
      if(id){
        dispatch(getPlanetTasks(Number(id)))
        setDescription(currentTask ? currentTask.description : '')
      }
    }, [])

    useEffect(() => {
      setName(currentTask ? currentTask.name : '')
      setDescription(currentTask ? currentTask.description : '')
    }, [currentTask])

    const navigate = useNavigate()
    const modules = {
        toolbar: [
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'video'],
          [{'align': ['right','center', false]}],
          ['clean']
        ],
      }
  
    function constructorClickHandler(evt: React.MouseEvent<HTMLLIElement>, id: number){
      const element = (evt.target as Element).classList.value
      if(element !== 'delete-icon'){
        setCurrentTask(tasks.find((task) => task.id === id) || tasks[0])
      }
    }

  function deleteTaskHandler(taskId: number){
    dispatch(deleteTask({planetId: Number(id), taskId: taskId}))
    setCurrentTask(tasks[-1])
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
                <button onClick={() => navigate('/curator')}>
                  <p><img src="/back-arrow.svg" alt=""></img> Вернуться к блокам</p>
                </button>
              </div>
              <ul>
                {tasks.map(task => <TaskConstructorTasks key={task.id} id={task.id} icon={"/monster-icon.svg"} name={task.name} date={task.created_at} onClickElement={constructorClickHandler} onDelete={deleteTaskHandler}/>)}
              </ul>
              <button className='new-task-button' type="submit"><img src="/add-icon.svg" alt=""/>Добавить новую задачу</button>
            </div>
            { currentTask && <div className='edit-content'>
              <input className="selected-block-name" value={name} onChange={onChangeNameHandler} placeholder="Введите название задачи" onBlur={onBlurHandler}></input>
              <ReactQuill theme="snow" value={description} onChange={onChangeDescriptionHandler} modules={modules} onBlur={onBlurHandler} />
            </div>}
        </div>
     );
}

export default TaskEditor;