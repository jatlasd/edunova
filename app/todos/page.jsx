import TodoTableContainer from '@components/todos/TodoTableContainer'
import React from 'react'

const TodoPage = () => {
  return (
    <div className='flex flex-col items-center gap-5 w-full  mt-40'>
      <TodoTableContainer/>
    </div>
  )
}

export default TodoPage