import React from 'react'

const TimestampTable = ({behavior}) => {
  return (
    <div className='flex flex-col'>
        <h1>{behavior.behavior}</h1>
        <button onClick={() => console.log(behavior.timestamps[0].time)}>click</button>
        <table className="w-full">
            <thead>
            <tr>
                <th className="border">Timestamp</th>
                <th className="border">Duration</th>
            </tr>
            </thead>
            <tbody>
            {behavior.timestamps.map((timestamp, index) => (
                <tr key={index}>
                <td className="border">{timestamp.time}</td>
                <td className="border">{timestamp.notes}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  )
}

export default TimestampTable