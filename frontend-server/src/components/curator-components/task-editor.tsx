
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ConstructorData } from '../../mocks/constructor-data';
import { useNavigate, useParams } from 'react-router-dom';
import TaskConstructorTasks from './task-constructor-tasks';

function TaskEditor() {
    const [value, setValue] = useState('');
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
    
    console.log(value.length)
    const {id} = useParams()
    
    return ( 
        <div className='task-edit-block'>
            <div className="selected-block-monster-list">
              <div className="monster-header">
                <button onClick={() => navigate('/curator')}>
                  <p><img src="/back-arrow.svg" alt=""></img> Вернуться к блокам</p>
                </button>
              </div>
              <ul>
                {ConstructorData[Number(id)].tasks.map(task => <TaskConstructorTasks key={task.id} id={task.id} icon={task.icon} name={task.name} date={task.date}/>)}
              </ul>
              <button className='new-task-button' type="submit"><img src="/add-icon.svg" alt=""/>Добавить новую задачу</button>
            </div>
            <div className='edit-content'>
              <input className="selected-block-name" placeholder="Введите название задачи"></input>
              <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} />
            </div>
        </div>
     );
}

export default TaskEditor;