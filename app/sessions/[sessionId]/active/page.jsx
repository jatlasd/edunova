import ActiveSessionContainer from '@components/sessions/ActiveSessionContainer'
import React from 'react'

const ActiveSession = ({params}) => {
  const {sessionId} = params
  return (
    <div className='w-full flex justify-center'>
      <ActiveSessionContainer sessionId={sessionId} />
    </div>
  )
}

export default ActiveSession