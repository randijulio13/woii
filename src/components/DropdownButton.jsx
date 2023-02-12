import React, { forwardRef } from 'react'

const DropdownButton = forwardRef((props, ref) => {
  const { children, ...prop } = props
  return (
    <button {...prop} ref={ref} className="w-full flex flex-col p-1 outline-none duration-200 hover:ring ring-blue-400 rounded-lg">{children}</button>
  )
})

export default DropdownButton
