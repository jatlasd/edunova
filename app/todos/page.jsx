import TodoTableContainer from '@components/todos/TodoTableContainer'
import React from 'react'

const TodoPage = () => {
  return (
    <div className='flex flex-col gap-5 w-1/5 ml-[300px] mt-40'>
      <TodoTableContainer/>
    </div>
  )
}

export default TodoPage