import React, {useEffect, useRef, useState} from 'react';
import { List, Map } from 'immutable';
import { useStateValue } from '../../context/State';
import * as actions from '../../context/State/actions';
import { Toolbar, DrawingSVG } from '../../components';
import styles from './DrawingBoard.module.scss';

function DrawingBoard() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawnLines, setDrawnLines] = useState(List());
    const [
        {
            selectedColor,
            selectedTool,
            selectedStrokeWidth,
        }, 
        dispatch] = useStateValue();
    // [[{x1,y1},{x2,y2}],[{x3,y3},{x4,y4}]]
    // M x1 y1 D x2 y2 D x3 y3 D x4 y4
    const drawingArea = useRef();
    useEffect(() => {
        // mouseup can be outside our drawingArea
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleTouchEnd);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);
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
        const points = getCoordinatesFromMouseEvent(e);
        setDrawnLines(drawnLines.updateIn([drawnLines.size - 1], (el) => el.push(points)));
    }
    const handleMouseUp = (e) => {
        if (e.button !== 0) return;
        console.log('handleMouseUp')
        setIsDrawing(false);
    }
    const handleTouchStart = (e) => {
        // console.log('handleTouchStart')
        const points = getCoordinatesFromTouchEvent(e)
        setIsDrawing(true);
        const newLine = List([points]);
        setDrawnLines(drawnLines.push(newLine));
    }
    const handleTouchEnd = (e) => {
        console.log('handleTouchEnd')
        setIsDrawing(false);
    }
    const handleTouchMove = (e) => {
        console.log('handleTouchMove')
        if (isDrawing) {
            const points = getCoordinatesFromTouchEvent(e)
            setDrawnLines(drawnLines.updateIn([drawnLines.size - 1], (el) => el.push(points)));
        }
        e.preventDefault();
    }
    const handleToolClick = (tool) => {
        dispatch(actions.setTool(tool))
    }
    const handleColorPicker = (color) => {
        dispatch(actions.setColor(color))
    }
    const handleStrokeWidthChange = (width) => {
        dispatch(actions.setStrokeWidth(width))
    }
    const getCoordinatesFromMouseEvent = (e) => {
        const boundingRect = drawingArea.current.getBoundingClientRect();
        const obj = {
            x: e.clientX - boundingRect.left,
            y: e.clientY - boundingRect.top
        };
        return Map(obj);
    }
    const getCoordinatesFromTouchEvent = (e) => {
        const boundingRect = drawingArea.current.getBoundingClientRect();
        const obj = {
            x: e.touches[0]?.clientX - boundingRect.left,
            y: e.touches[0]?.clientY -  boundingRect.top
        };
        return Map(obj);
    }
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <h4>Drawing Board</h4>
                <Toolbar 
                    selectedColor={selectedColor}
                    selectedTool={selectedTool}
                    selectedStrokeWidth={selectedStrokeWidth}
                    onChangeTool={handleToolClick}
                    onChangeColor={handleColorPicker}
                    onChangeStrokeWidth={handleStrokeWidthChange}
                />
            </div>
            <div 
                ref={drawingArea} 
                className={styles.canvasWrapper}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
            >
                <DrawingSVG lines={drawnLines}/>
            </div>
        </div>
    )
}

export default DrawingBoard
