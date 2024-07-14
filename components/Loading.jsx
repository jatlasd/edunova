import React from 'react'

const Loading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
    <div className="loader flex justify-end">
      <h1 className="mr-1 pb-4 text-3xl font-semibold text-primary-tint/40">
        Loading
      </h1>
      <span className="bg-primary-tint/30"></span>
      <span className="bg-primary-tint/30"></span>
      <span className="bg-primary-tint/30"></span>
    </div>
  </div>
  )
}

export default Loading