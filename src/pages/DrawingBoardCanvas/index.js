import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import cx from 'classnames'

import { useStateValue } from '../../context/State';
import * as actions from '../../context/State/actions';
import { Toolbar } from '../../components';
import { TOOLS, ERASER_DEFAULT_WIDTH, HIGHLIGHTER_DEFAULT_WIDTH } from '../../constants';
import { hexToRGB } from '../../utils'
import styles from './DrawingBoardCanvas.module.scss';
let lastPoint = {}
const highLighterPoints = [];
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
        // setCanvasWidth(window.innerHeight);
        // setCanvasHeight(window.innerHeight);
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
        if (ctx) {
            switch (selectedTool) {
                case TOOLS.PEN:
                    ctx.strokeStyle = getStrokeColorBasedOnTool();
                    ctx.lineWidth = getStrokeWidthBasedOnTool();
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(points.x, points.y);
                    break;
                case TOOLS.ERASER: 
                    ctx.clearRect(points.x, points.y, ERASER_DEFAULT_WIDTH, ERASER_DEFAULT_WIDTH);
                    break;
                case TOOLS.HIGHLIGHTER: 
                    const color = hexToRGB(getStrokeColorBasedOnTool());
                    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;
                    ctx.lineWidth = getStrokeWidthBasedOnTool();
                    ctx.lineCap = 'round';
                    // lastPoint = points;
                    highLighterPoints.push(points);
                    break;
                default:
                    break;
            }
        }
    }
    const handleDrawingEvent = (e) => {
        if (!isDrawing || (e.type === 'mousemove' && e.button !== 0)) return;
        const points = getCoordinatesFromEvent(e);
        const ctx = getCanvasContext();
        if (ctx) {
            switch (selectedTool) {
                case TOOLS.PEN:
                    ctx.lineTo(points.x, points.y);
                    ctx.stroke()
                    break;
                case TOOLS.ERASER: 
                    ctx.clearRect(points.x, points.y, ERASER_DEFAULT_WIDTH, ERASER_DEFAULT_WIDTH);
                    break;
                case TOOLS.HIGHLIGHTER:
                    const lastPoint = highLighterPoints[highLighterPoints.length - 1];
                    ctx.beginPath();
                    ctx.moveTo(lastPoint?.x, lastPoint?.y)
                    ctx.lineTo(points.x, points.y);
                    ctx.stroke();
                    ctx.closePath();
                    highLighterPoints.push(points);
                    break;
                default:
                    break;
            }
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
            >
                <canvas 
                    ref={canvasRef} 
                    width={canvasWidth}
                    height={canvasHeight}
                    className={cx(styles.canvas)}
                    onMouseDown={handleDrawingStartEvent}
                    onMouseMove={handleDrawingEvent}
                    onTouchStart={handleDrawingStartEvent}
                    onTouchMove={handleDrawingEvent}
                >
                </canvas>
            </div>
        </div>
    )
}

export default DrawingBoardCanvas
