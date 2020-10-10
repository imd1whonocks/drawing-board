import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import cx from 'classnames'

import { useStateValue } from '../../context/State';
import * as actions from '../../context/State/actions';
import { Toolbar } from '../../components';
import { TOOLS, ERASER_DEFAULT_WIDTH, HIGHLIGHTER_DEFAULT_WIDTH } from '../../constants';
import { hexToRGB } from '../../utils'
import styles from './DrawingBoardCanvas.module.scss';

let lastHighlighterPoints = {};

function DrawingBoardCanvas() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState(500);
    const [canvasHeight, setCanvasHeight] = useState(500);
    const [
        {
            selectedColor,
            selectedTool,
            selectedStrokeWidth,
        }, 
        dispatch] = useStateValue();
    const drawingArea = useRef();
    const canvasRef = useRef();
    const highlighterCanvasRef = useRef();
    useEffect(() => {
        // mouseup can be outside our drawingArea
        document.addEventListener('mouseup', handleDrawingOverEvent);
        document.addEventListener('touchend', handleDrawingOverEvent);
        // document.addEventListener('resize',)
        return () => {
            document.removeEventListener('mouseup', handleDrawingOverEvent);
            document.removeEventListener('touchend', handleDrawingOverEvent);
        }
    }, []);
    useLayoutEffect(() => {
        const scale = window.devicePixelRatio;
        // to solve blur on MBP screens
        setCanvasWidth(drawingArea.current.clientWidth * scale)
        setCanvasHeight(drawingArea.current.clientHeight * scale)
        // Normalize coordinate system to use css pixels.
        const ctx = getCanvasContext();
        ctx.scale(scale, scale);
    }, [])
    const handleDrawingStartEvent = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;
        setIsDrawing(true);
        const points = getCoordinatesFromEvent(e);
        const ctx = getCanvasContext();
        const highlighterCtx = getHighlighterCanvasContext();
        clearHighlighterCanvas();
        switch (selectedTool) {
            case TOOLS.PEN:
                if (ctx) {
                    ctx.strokeStyle = getStrokeColorBasedOnTool();
                    ctx.lineWidth = getStrokeWidthBasedOnTool();
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(points.x, points.y);
                }
                break;
            case TOOLS.ERASER: 
                ctx &&  ctx.clearRect(points.x, points.y, ERASER_DEFAULT_WIDTH, ERASER_DEFAULT_WIDTH);
                break;
            case TOOLS.HIGHLIGHTER: 
                const color = hexToRGB(getStrokeColorBasedOnTool());
                if (highlighterCtx) {
                    highlighterCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
                    highlighterCtx.lineWidth = getStrokeWidthBasedOnTool();
                    highlighterCtx.lineCap = 'round';
                }
                lastHighlighterPoints = points;
                break;
            default:
                break;
        }
        if (ctx || highlighterCtx) {
        }
    }
    const handleDrawingEvent = (e) => {
        if (!isDrawing || (e.type === 'mousemove' && e.button !== 0)) return;
        const points = getCoordinatesFromEvent(e);
        const ctx = getCanvasContext();
        const highlighterCtx = getHighlighterCanvasContext();
        switch (selectedTool) {
            case TOOLS.PEN:
                ctx && ctx.lineTo(points.x, points.y);
                ctx && ctx.stroke()
                break;
            case TOOLS.ERASER: 
                ctx && ctx.clearRect(points.x, points.y, ERASER_DEFAULT_WIDTH, ERASER_DEFAULT_WIDTH);
                break;
            case TOOLS.HIGHLIGHTER:
                if (highlighterCtx) {
                    highlighterCtx.beginPath();
                    highlighterCtx.moveTo(lastHighlighterPoints?.x, lastHighlighterPoints?.y);
                    highlighterCtx.lineTo(points.x, points.y);
                    highlighterCtx.stroke();
                    highlighterCtx.closePath();
                }
                lastHighlighterPoints = points;
                break;
            default:
                break;
        }
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
    }
    const handleDrawingOverEvent = (e) => {
        if (e.button && e.button !== 0) return;
        setIsDrawing(false);
        const ctx = getCanvasContext();
        ctx.closePath();
    }
    const handleToolClick = (tool) => {
        dispatch(actions.setTool(tool));
        clearHighlighterCanvas();
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
        const boundingRect = canvasRef.current.getBoundingClientRect();
        const obj = {
            x: e.clientX - boundingRect.left,
            y: e.clientY - boundingRect.top
        };
        return obj;
    }
    const getCoordinatesFromTouchEvent = (e) => {
        const boundingRect = canvasRef.current.getBoundingClientRect();
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
    const getCanvasContext = () => {
        const ctx = canvasRef?.current?.getContext('2d');
        return ctx;
    }   
    const clearHighlighterCanvas = () => {
        const highlighterCtx = getHighlighterCanvasContext();
        highlighterCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
    const getHighlighterCanvasContext = () => {
        const ctx = highlighterCanvasRef?.current?.getContext('2d');
        return ctx;
    }    
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <h4>Canvas Drawing Board</h4>
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
                <canvas 
                    ref={canvasRef} 
                    width={canvasWidth}
                    height={canvasHeight}
                    className={cx(styles.canvas)}
                />
                <canvas 
                    ref={highlighterCanvasRef} 
                    width={canvasWidth}
                    height={canvasHeight}
                    className={cx(styles.highlighterCanvas, {[styles.visible]: selectedTool === TOOLS.HIGHLIGHTER})}
                />
            </div>
        </div>
    )
}

export default DrawingBoardCanvas
