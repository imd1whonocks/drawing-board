import React, {useEffect, useRef, useState} from 'react';
import { List, Map } from 'immutable';
import styles from './DrawingBoard.module.scss';

function DrawingBoard() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawnLines, setDrawnLines] = useState(List());
    // [[{x1,y1},{x2,y2}],[{x3,y3},{x4,y4}]]
    // M x1 y1 D x2 y2 D x3 y3 D x4 y4
    const drawingArea = useRef();
    useEffect(() => {
        // mouseup can be outside our drawingArea
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.addEventListener('mouseup', handleMouseUp);
        }
    }, [])
    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        console.log('handleMouseDown')
        const points = getCoordinatesFromMouseEvent(e)
        setIsDrawing(true);
        const newLine = List([points]);
        setDrawnLines(drawnLines.push(newLine));
    }
    const handleMouseMove = (e) => {
        if (e.button !== 0 || !isDrawing) return;
        const points = getCoordinatesFromMouseEvent(e)
        
        setDrawnLines(drawnLines.updateIn([drawnLines.size - 1], (el) => el.push(points)));
    }
    const handleMouseUp = (e) => {
        if (e.button !== 0) return;
        console.log('handleMouseUp')
        setIsDrawing(false);
    }
    const getCoordinatesFromMouseEvent = (e) => {
        const boundingRect = drawingArea.current.getBoundingClientRect();
        const obj = {
            x: e.clientX - boundingRect.left,
            y: e.clientY - boundingRect.top
        };
        return Map(obj);
    }
    return (
        <div className={styles.root}>
            <div 
                ref={drawingArea} 
                className={styles.canvasWrapper}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                <svg id="canvas" crossOrigin='anonymous' className={styles.canvas}
                    width="500" height="500"
                    version="1.1" xmlns="http://www.w3.org/2000/svg"
                >
                    {drawnLines.map((line, index) => {
                        const pathData = "M " +
                        line
                        .map(p => p.get('x') + ' ' + p.get('y'))
                        .join(" L ");
                        return <path d={pathData} key={index} />;
                    })};
                </svg>
            </div>
        </div>
    )
}

export default DrawingBoard
