import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BsCircleFill, BsFillTrashFill } from "react-icons/bs";

import "./App.css";

function App() {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8081')
      .then(res => setTodos(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleAdd = () => {
    axios.post('http://localhost:8081/create', { task: task })
      .then(result => {
        console.log(result)
        // Yeni bir görev eklendikten sonra güncel görev listesini almak için yeniden istekte bulun
        axios.get('http://localhost:8081')
          .then(res => setTodos(res.data))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    setTask('');
  }

  const handleToggleComplete = (todo_id, todo_completed) => {
    axios.put(`http://localhost:8081/update/${todo_id}`, { todo_completed: todo_completed })
      .then(result => {
        console.log(result);
        axios.get('http://localhost:8081')
          .then(res => setTodos(res.data))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  const handleDelete = (todo_id) => {
    axios.delete(`http://localhost:8081/delete/${todo_id}`)
      .then(result => {
        console.log(result)
        // Bir görev silindikten sonra güncel görev listesini almak için yeniden istekte bulun
        axios.get('http://localhost:8081')
          .then(res => setTodos(res.data))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      <div className='home'>
        <h2> Todo App </h2>
        <div className='create_form'>
          <input type="text" value={task} placeholder='Bir task girin' onChange={(e) => setTask(e.target.value)} />
          <button type="button" onClick={handleAdd}>Add</button>
        </div>

        {
          todos.length === 0
            ? <div><h2> Kayıt Yok </h2></div>
            : todos.map(todo => (
              <div key={todo.todo_id} className={`task ${todo.todo_completed ? 'completed' : ''}`}>
                <div className='checkbox' onClick={() => handleToggleComplete(todo.todo_id, !todo.todo_completed)}>
                  
                  <input type="checkbox"
                    checked={todo.todo_completed} />
                  <p>{todo.todo_desc}</p>
                </div>
                <div>
                  <span onClick={() => handleDelete(todo.todo_id)}><BsFillTrashFill className='icon' /></span>
                </div>
              </div>
            ))

        }
      </div>
    </>
  )
}

export default App
