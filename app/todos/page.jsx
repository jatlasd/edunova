import AddTodoDialog from '@components/todos/AddTodoDialog'
import Notebook from '@components/todos/Notebook'
import TodoTableContainer from '@components/todos/TodoTableContainer'
import React from 'react'

const TodoPage = () => {
  return (
    <div className='flex flex-col items-center gap-5 w-full'>
      <div className='flex w-full justify-center gap-20 my-20'>
        <AddTodoDialog/>
        <AddTodoDialog type="bug"/>
      </div>
      <TodoTableContainer/>
      <div className='w-full flex justify-center mb-20'>
        <Notebook />
      </div>
    </div>
  )
}

export default TodoPage