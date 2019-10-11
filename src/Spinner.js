import React from 'react';
import styles from './Spinner.module.css';

const spinner = props => (
<div className={styles.spinner} style={{ zIndex: 1000, position: 'relative'}}></div>    
);

export default spinner;