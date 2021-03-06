import React, {forwardRef} from 'react';
import cx from 'classnames'

import styles from './WidthSelector.module.scss';

const widthOptions = [
    {
        text: '1 px',
        width: '1'
    },
    {
        text: '3 px',
        width: '3'
    },
    {
        text: '5 px',
        width: '5'
    }
]
export const WidthSelector = forwardRef((props, ref) => {
    const { onChangeStrokeWidth, selectedStrokeWidth } = props;
    const handleWidthPicker = (option) => {
        onChangeStrokeWidth && onChangeStrokeWidth(option.width)
    }
    return (
        <div className={styles.root} ref={ref}>
            {widthOptions.map((option,index) => (
                <div className={cx(styles.widthOptionWrapper, {[styles.selected]: selectedStrokeWidth === option.width})}
                    onClick={() => handleWidthPicker(option)}
                    key={index}
                >
                    <div className={styles.widthOption} style={{height: `${option.width}px`}}></div>
                </div>
            ))}
        </div>
    )
})

export default WidthSelector


