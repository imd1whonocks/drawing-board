import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';

import { WidthSelector } from '../../components';
import { TOOLS } from '../../constants';
import Pen from '../../assets/images/pen.svg';
import Highlighter from '../../assets/images/highlighter.svg';
import Eraser from '../../assets/images/eraser.svg';
import Clear from '../../assets/images/clear.svg';

import styles from './Toolbar.module.scss';

const tools = [
    {
        name: TOOLS.PEN,
        type: TOOLS.PEN,
        image: Pen,
    },
    {
        name: TOOLS.HIGHLIGHTER,
        type: TOOLS.HIGHLIGHTER,
        image: Highlighter,
    },
    {
        name: TOOLS.ERASER,
        type: TOOLS.ERASER,
        image: Eraser,
    }
]

function Toolbar({
    selectedColor,
    selectedTool,
    selectedStrokeWidth,
    onChangeTool,
    onChangeColor,
    onChangeStrokeWidth,
    onClearAll,
}) {
    const [isWidthSelectorOpen, setIsWidthSelectorOpen] = useState(false);
    const widthSelectorRef = useRef(null)
    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])
    const handleColorPicker = (e) => {
        onChangeColor && onChangeColor(e.target.value)
    }
    const handleStrokeSelection = (width) => {
        onChangeStrokeWidth && onChangeStrokeWidth(width);
        setIsWidthSelectorOpen(false);
    }
    const handleToolClick = (tool) => {
        onChangeTool && onChangeTool(tool.type);
        if (tool.type === TOOLS.PEN) {
            setIsWidthSelectorOpen(!isWidthSelectorOpen);
        }
    }
    const handleClearAll = (width) => {
        onClearAll && onClearAll(width);
    }
    const handleClickOutside = (event) => {
        if (widthSelectorRef.current 
            && !widthSelectorRef.current.contains(event.target)
            && event.target.alt !== TOOLS.PEN) {
            setIsWidthSelectorOpen(false);
        }
    };
    return (
        <div className={styles.root}>
            <div className={styles.tools}>
                {tools.map((tool, index) => (
                    <div key={index} 
                        className={cx(styles.tool, {[styles.selected]: tool.type === selectedTool})} 
                        onClick={() => handleToolClick(tool)}>
                        <img src={tool.image} alt={tool.name} className={styles.image}/>
                    </div>
                ))}
            </div>
            {isWidthSelectorOpen ? 
                <WidthSelector 
                ref={widthSelectorRef}
                selectedStrokeWidth={selectedStrokeWidth}
                onChangeStrokeWidth={handleStrokeSelection}
            /> : null }
            <div className={styles.colorpickerBox}>
                <input 
                    className={styles.picker} 
                    type="color" 
                    id="strokeColor" 
                    name="strokeColor" 
                    value={selectedColor}
                    onChange={handleColorPicker}
                />
                <label htmlFor="strokeColor"></label>
            </div>
            <div className={styles.clearIcon} onClick={handleClearAll}>
                <img src={Clear} alt={'clear'} className={styles.image}/>
            </div>
        </div>
    )
}

export default Toolbar
