import AddTodoDialog from '@components/todos/AddTodoDialog'
import React from 'react'

const TodoPage = () => {
  return (
    <div className='flex flex-col gap-5 w-1/5 ml-[300px] mt-40'>
        <AddTodoDialog type="bug"/>
        <AddTodoDialog />
    </div>
  )
}

export default TodoPage