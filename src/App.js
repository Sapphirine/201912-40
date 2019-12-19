import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Main from "./components/Main";
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="Heading">
                    <h1><b>BART ML</b></h1>
                </div>
                <Main />
            </div>
        );
    }
}

export default withRouter(App);
