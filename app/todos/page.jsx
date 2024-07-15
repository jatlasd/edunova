import AddTodoDialog from '@components/todos/AddTodoDialog'
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

    </div>
  )
}

export default TodoPage