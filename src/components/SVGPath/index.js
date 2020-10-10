import React, {memo} from 'react'

function SVGPath({
    line=[], // array of points
    strokeColor='#000',
    strokeWidth='2px',
}) {
    const pathData = line.map(point => `${point.get('x')} ${point.get('y')}`).join(' L ')
    return (
        <path d={`M ${pathData}`} stroke={strokeColor} strokeWidth={strokeWidth}/>
    )
}

export default memo(SVGPath)
