import React from 'react'

export default function Container(props) {
    const { children, className } = props
    return (
        <div {...props} className={`${className} px-4 lg:px-40`}>{children}</div>
    )
}
