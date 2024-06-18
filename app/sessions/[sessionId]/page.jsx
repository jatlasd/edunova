import SessionDetailsContainer from '@components/sessions/SessionDetailsContainer'

const StoredSession = ({params}) => {
  const { sessionId } = params
  return (
    <div>
      <SessionDetailsContainer sessionId={sessionId}/>
    </div>
  )
}

export default StoredSession