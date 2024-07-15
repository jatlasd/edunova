import React from 'react'
import { cn } from '@/lib/utils'

const Loading = ({fontSize, spanSize, className}) => {
  return (
    <div className={cn("flex h-full w-full flex-col items-center justify-center", className)}>
      <div className="loader flex justify-end">
        <h1 className={`mr-1 pb-4 font-semibold text-primary-tint/40 ${fontSize ? fontSize : 'text-3xl'}`}>
          Loading
        </h1>
        <span className={`bg-primary-tint/30 ${spanSize ? spanSize : 'h-[6px] w-[6px]'}`}></span>
        <span className={`bg-primary-tint/30 ${spanSize ? spanSize : 'h-[6px] w-[6px]'}`}></span>
        <span className={`bg-primary-tint/30 ${spanSize ? spanSize : 'h-[6px] w-[6px]'}`}></span>
      </div>
  </div>
  )
}

export default Loading