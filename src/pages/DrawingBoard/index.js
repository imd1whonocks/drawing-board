import React, {useEffect, useRef, useState} from 'react';

import { useStateValue } from '../../context/State';
import * as actions from '../../context/State/actions';
import { Toolbar, DrawingSVG } from '../../components';
import { TOOLS, ERASER_DEFAULT_WIDTH, HIGHLIGHTER_DEFAULT_WIDTH } from '../../constants';
import styles from './DrawingBoard.module.scss';

function DrawingBoard() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawnLines, setDrawnLines] = useState([]);
    const [
        {
            selectedColor,
            selectedTool,
            selectedStrokeWidth,
        }, 
        dispatch] = useStateValue();
    const drawingArea = useRef();
    useEffect(() => {
        // mouseup can be outside our drawingArea
        document.addEventListener('mouseup', handleDrawingOverEvent);
        document.addEventListener('touchend', handleDrawingOverEvent);
        return () => {
            document.removeEventListener('mouseup', handleDrawingOverEvent);
            document.removeEventListener('touchend', handleDrawingOverEvent);
        }
    }, [])
    const handleDrawingStartEvent = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;
        setIsDrawing(true);
        const points = getCoordinatesFromEvent(e);
        const obj = {
            tool: selectedTool,
            strokeWidth: getStrokeWidthBasedOnTool(),
            strokeColor: getStrokeColorBasedOnTool(),
            strokeOpacity: selectedTool === TOOLS.HIGHLIGHTER ? 0.5 : 1,
            points: [points]
        }
        const lastDrawnLine = drawnLines[drawnLines.length - 1];
        if (lastDrawnLine?.tool === TOOLS.HIGHLIGHTER) {
            drawnLines.splice(drawnLines.length - 1, 1)
        }
        setDrawnLines([...drawnLines, obj]);
    }
    const handleDrawingEvent = (e) => {
        if (!isDrawing || (e.type === 'mousemove' && e.button !== 0)) return;
        const points = getCoordinatesFromEvent(e);
        const drawnLinesClone = [...drawnLines];
        const item = {...drawnLinesClone[drawnLines.length - 1]};
        const pointsClone = [...item.points];
        pointsClone.push(points);
        item.points = pointsClone;
        drawnLinesClone[drawnLines.length - 1] = item;
        setDrawnLines(drawnLinesClone);
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
    }
    const handleDrawingOverEvent = (e) => {
        if (e.button && e.button !== 0) return;
        console.log('handleMouseUp')
        setIsDrawing(false);
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
    const getCoordinatesFromEvent = (e) => {
        let points;
        if (['mousedown', 'mousemove', 'mouseup'].includes(e.type)) {
            points = getCoordinatesFromMouseEvent(e)
        } else if (['touchdown', 'touchmove', 'touchstart'].includes(e.type)) {
            points = getCoordinatesFromTouchEvent(e)
        }
        return points;
    }
    const getCoordinatesFromMouseEvent = (e) => {
        const boundingRect = drawingArea.current.getBoundingClientRect();
        const obj = {
            x: e.clientX - boundingRect.left,
            y: e.clientY - boundingRect.top
        };
        return obj;
    }
    const getCoordinatesFromTouchEvent = (e) => {
        const boundingRect = drawingArea.current.getBoundingClientRect();
        const obj = {
            x: e.touches[0]?.clientX - boundingRect.left,
            y: e.touches[0]?.clientY -  boundingRect.top
        };
        return obj;
    }
    const getStrokeWidthBasedOnTool = () => {
        let strokeWidth;
        switch (selectedTool) {
            case TOOLS.PEN:
                strokeWidth = selectedStrokeWidth;
                break;
            case TOOLS.ERASER:
                strokeWidth = ERASER_DEFAULT_WIDTH;  
                break;
            case TOOLS.HIGHLIGHTER:
                strokeWidth = HIGHLIGHTER_DEFAULT_WIDTH;  
                break;
            default:
                strokeWidth = '2px'
                break;
        }
        return strokeWidth;
    }
    const getStrokeColorBasedOnTool = () => {
        let strokeColor;
        switch (selectedTool) {
            case TOOLS.PEN:
            case TOOLS.HIGHLIGHTER:
                strokeColor = selectedColor;
                break;
            case TOOLS.ERASER:
                strokeColor = '#FFF';  
                break;
            default:
                strokeColor = '#000'
                break;
        }
        return strokeColor;
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
                onMouseDown={handleDrawingStartEvent}
                onMouseMove={handleDrawingEvent}
                onTouchStart={handleDrawingStartEvent}
                onTouchMove={handleDrawingEvent}
            >
                <DrawingSVG lines={drawnLines}/>
            </div>
        </div>
    )
}

export default DrawingBoard
