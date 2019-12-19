import React, { Component } from 'react'
import '../css/Main.css';
import RM from './RM.js';

class Main extends Component {
    render() {
        return (
            <div className="Main">
                <div className="RM">
                    <h2>Text Analysis</h2>
                    <RM></RM>
                </div>
            </div>
        );
    }
}

export default Main;
