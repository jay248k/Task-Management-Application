import React from 'react'
import {Routes,Route} from 'react-router-dom'
import { TaskList } from './components/TaskList'
import { CreateTask } from './components/CreateTask'
import {EditTask} from './components/EditTask'
function App(){
  return (
    <>
      <Routes>
        <Route path='/' element={<TaskList/>}/>
        <Route path='/create-task' element={<CreateTask/>}/>
        <Route path='/edit-task/:id' element={<EditTask/>}/>
      </Routes>
    </>
  )
}

export default App;