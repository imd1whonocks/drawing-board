import React, {memo} from 'react'
import SVGPath from '../SVGPath';
import styles from './DrawingSVG.module.scss';

function DrawingSVG({
    lines=[]
}) {
    return (
        <svg id="canvas" crossOrigin='anonymous' className={styles.canvas}
            width="500" height="500"
            version="1.1" xmlns="http://www.w3.org/2000/svg"
        >
            {lines.map((line, index) => 
                <SVGPath 
                    points={line.points} 
                    key={index}
                    strokeColor={line.strokeColor}
                    strokeWidth={line.strokeWidth}
                    strokeOpacity={line.strokeOpacity}
                />
            )}
        </svg>
    )
}

export default memo(DrawingSVG);
