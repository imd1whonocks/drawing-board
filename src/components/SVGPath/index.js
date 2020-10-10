import React, {memo} from 'react'

function SVGPath({
    points=[], // array of points
    strokeColor='#000',
    strokeWidth='2px',
    strokeOpacity=1,
}) {
    // [[{x1,y1},{x2,y2}],[{x3,y3},{x4,y4}]]
    // M x1 y1 D x2 y2 D x3 y3 D x4 y4
    const pathData = points.map(point => `${point['x']} ${point['y']}`).join(' L ')
    return (
        <path 
            d={`M ${pathData}`} 
            stroke={strokeColor} 
            strokeWidth={strokeWidth} 
            strokeOpacity={strokeOpacity}
        />
    )
}

export default memo(SVGPath)
