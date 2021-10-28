
import './App.css';
import React, { useEffect, useRef, useState } from "react";
import Toolbar from './Toolbar';
var CodeMirror = require('react-codemirror');
require('codemirror/lib/codemirror.css');
//import { ToolbarClass }from './ToolbarClass';
//url for local or production

class CodeMode extends React.Component {
    constructor(props) {
        super(props);
        //creates variables needed, use this.state.variable
        this.state = {
            editor: ""
        }
        this.getInitialState = this.getInitialState.bind(this)
        this.updateCode = this.updateCode.bind(this)
        this.runCode = this.runCode.bind(this)
        // make this.setState available in function
    }


    getInitialState() {
		return {
			code: "// Code",
		};
	}

	updateCode(newCode) {
		this.setState({
			code: newCode,
		});
	}
    

    runCode(code) {
        var data = {
            code: btoa(code)
        };
        
        fetch("https://execjs.emilfolino.se/code", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
            let decodedOutput = atob(result.data);
            alert(decodedOutput)
            //console.log(decodedOutput); // outputs: hej
            return(decodedOutput)
        },
        (error) => {
            console.log(error)
        });
    }

    render() {
        var options = {
			lineNumbers: true,
		};
        //<input type="button" value="Create doc" className="toolbar" onClick={this.createNewDoc}/>
        //<input type="button" value="Update doc" className="toolbar" onClick={this.updateDoc}/>
        //<label>Namn: </label>
        //<input type="text" name="nameArea" class="textinput" onChange={this.updateName}/>
        if (this.state.editor === "editor") {
            return (
                <>
                <Toolbar token={this.props.token} user={this.props.user}/>
                </>
            )
        }
        return (
            <>
            <input type="button" value="Run code" className="toolbar" onClick={this.runCode}/>
            <div class="editorDiv">
            <CodeMirror
            value={this.state.code} 
            onChange={() => this.updateCode(this.state.code)} 
            options={options} 
            />
            </div>
            <input type="button" value="EditorMode" className="toolbar" onClick={() => {
                this.setState({editor: "editor"})
                
            }}/>
           </>
        );
    }
}

export {CodeMode};