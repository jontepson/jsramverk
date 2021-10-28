import './App.css';
import React, { useEffect, useRef, useState } from "react";

import { Editor } from '@tinymce/tinymce-react';
import socketIOClient from "socket.io-client";
import { jsPDF } from "jspdf";
import { CodeMode } from "./codeModeClass.js"
var CodeMirror = require('react-codemirror');
require('codemirror/lib/codemirror.css');
//const ENDPOINT = "http://127.0.0.1:1337";
const ENDPOINT = "https://jsramverk-editor-jopt19.azurewebsites.net";

const socket = socketIOClient(ENDPOINT);



function Toolbar(props) {
    const [content, setContent] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [item, setItem] = useState([]);
    const [name, setName] = useState([]);
    const [code, setCode] = useState([]);
	  const [contentList, setContentList] = useState([]);
	  const [mode, setMode] = useState([]);
    const [email, setEmail] = useState([]);
    const editorRef = useRef(null);
    
    //setCode({code: ""})
	  const user = props.user;
	  const token = props.token;
    // Functions for interacting with editor"
    socket.on("doc", (data) => {
      if (editorRef.current) {
        editorRef.current.setContent(data.content);
      }
    });
	if (!mode.mode) {
		setMode({mode: "editorMode"})
	}
    function sendMail() {
      const msg = {
        to: email.receiver,
        from: 'jopt19@hackermail.com',
        subject: 'Invite to edit my document',
        text: 'Welcome to edit my document at https://www.student.bth.se/~jopt19/editor/',
        html: '<strong>Welcome to edit my document at https://www.student.bth.se/~jopt19/editor/</strong>',
      };
      let validusersList = item.valid_users
      validusersList.push(email.receiver)
      
      fetch("https://jsramverk-editor-jopt19.azurewebsites.net/invite", {
            method: 'POST',
            body: JSON.stringify(msg),
            headers: {"Content-type": 'application/json'}
        }).then(res => {
          console.log("Invite send");
        })
        let body = {
          "id": item._id,
          "content": item.content,
          "name": name.name,
          "valid_users": validusersList
        }
        //console.log(body)
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor", {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: {"Content-type": 'application/json', "x-access-token": token},
        }).then(response => {
          alert(email.receiver + " now has access to this doc")
      })
    
      
    }

    function log() {
      let myContent = "";
      if (editorRef.current) {
        //console.log(editorRef.current.getContent());
        myContent = editorRef.current.getContent();
      }
	  console.log(contentList)
      return myContent;
    };
	function getUsersDocsGraphQL() {
		let GraphQLQuery = { query: '{ Usersdoc(user: "' + user + '", mode: "' + mode.mode + '") { name, content, valid_users, _id } }' }
		//console.log(GraphQLQuery)
		//fetch("http://localhost:1337/graphql", {
		fetch("https://jsramverk-editor-jopt19.azurewebsites.net/graphql", {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  'Accept': 'application/json',
		  "x-access-token": token
		},
		body: JSON.stringify(GraphQLQuery)
	  })
		.then(r => r.json())
		.then(
		  (result) => {
			setIsLoaded(true);
			//console.log(result.data)
			setItems(result.data.Usersdoc);
		  	//console.log(items)
			},
		  (error) => {
			setIsLoaded(true);
			setError(error);
		  }
		)
	}


    function createNewDoc() {
        let body = {
              "content": content.content,
              "name": name.name,
              "valid_users": [user, "admin@admin.se"],
              "mode": mode.mode
        }
		//console.log(body)
        let url = "https://jsramverk-editor-jopt19.azurewebsites.net/editor"
		
        //let url = "http://localhost:1337/editor"
        fetch(url, {
            method: 'POST',
            headers: {"Content-type": 'application/json', "x-access-token": token},
            body: JSON.stringify(body)
        }).then(response => {
          	alert("Document created");
			getUsersDocsGraphQL();
          	response.json(204);
        })
    }
    function myNameChangeHandler(event) {
        setName({name: event.target.value});
      }
    function myContentChangeHandler() {
      // onChange letar efter event, t.ex enter fungerar.
        var EditorContent = editorRef.current.getContent()
        setContent({content: EditorContent});
        let body = {
          "id": item._id,
          "content": content.content,
          "name": name.name
        }
        socket.emit("doc", body);  
    }
    function myEmailReceiverChangeHandler(event) {
        setEmail({receiver: event.target.value});
    }
    function updateDoc() {
	
      let validusersList = item.valid_users
      if (!validusersList.includes("admin@admin.se")) {
        validusersList.push("admin@admin.se")
      }
        let body = {
            "id": item._id,
            "content": content.content,
            "name": name.name,
            "valid_users": validusersList,
			"mode": mode.mode
        }
		//console.log(body)
		//fetch("http://localhost:1337/editor", {
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor", {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {"Content-type": 'application/json', "x-access-token": token},
        }).then(response => {
			getUsersDocsGraphQL()
        })
    }

    function getOneGraphQL(id) {
		let GraphQLQuery = { query: '{ OneDoc(id: "' + id + '") { _id, name, content, valid_users } }' }
		//console.log(GraphQLQuery)
		//fetch("http://localhost:1337/graphql", {
		fetch("https://jsramverk-editor-jopt19.azurewebsites.net/graphql", {
      	method: 'POST',
      	headers: {
        	'Content-Type': 'application/json',
        	'Accept': 'application/json',
			    "x-access-token": token
      	},
      	body: JSON.stringify(GraphQLQuery)
    	})
      	.then(r => r.json())
      	.then(
        	(result) => {
          	socket.emit("create", id);
          	setIsLoaded(true);
          	//console.log(result.data.OneDoc.valid_users)
          	setName({name: result.data.OneDoc.name});
			setContent({content: result.data.OneDoc.content})
          	setItem(result.data.OneDoc);
			let contentList = result.data.OneDoc.content.split("\n").map((item) =>
  				<li>{item}</li>
				);
			setContentList(contentList)
			 // console.log(item)
        	},
        	(error) => {
          	setIsLoaded(true);
          	setError(error);
        	}
      	)
	}

    function saveAsPDF () {
      const doc = new jsPDF();
      //console.log(content.content)
      //console.log(name.name)
	  doc.html(content.content, {
		callback: function (doc) {
		  doc.save(name.name + ".pdf");
		}
	 });
      //doc.text(content.content, 10, 10);
      //doc.save(name.name + ".pdf");
    }

    ///
    ///
    ///
    /// CODE MODE
    ///
    ///
    ///

    function updateCode(newCode) {
		setContent({content: newCode});
    }
      
  
    function runCode(content) {
		if (!content) {
			setContent({content: item.content})
		}
          var data = {
              code: btoa(content)
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
              alert(decodedOutput);
			  return(decodedOutput);
              //console.log(decodedOutput); // outputs: hej
          },
          (error) => {
              console.log(error)
          });
      }
  
if (mode.mode === "codeMode") {
  var options = {
    lineNumbers: true,
  };
  if (items.length > 0) {
	return (
			<>
			<div class="mainDiv">
				{/**Toolbar buttons*/}
				
				<div class="navbar">
				<ul>
				<h2 data-testid="redigera">Redigera dokument: </h2>
				{items.map((data, key) => {
			  return (
					<button class="toolbar" onClick={() => getOneGraphQL(data._id)}>{data.name}</button>
			  );
			})}
			</ul>
			</div> 
			<div class="toolbarDiv">
			<label>Namn: </label>
					<input type="text" name="nameArea" class="textinput" placeholder={item.name} onChange={myNameChangeHandler}/>
					<input type="button" value="Run code" className="toolbar" onClick={() => runCode(content.content)}/>
					<input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={updateDoc}/>
					<input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={createNewDoc}/>
				{/**<input type="button" data-testid="create" value="Spara som PDF" className="toolbar" onClick={saveAsPDF}/>*/}
			</div>
					{/**<input type="button" value="Ta bort" className="toolbar" onClick={deleteDoc}/>*/}
					<div class="editorDiv">
  		<CodeMirror
    		value={item.content}
    		onChange={updateCode}
    		options={options} 
    		/>
  		</div>
		<input type="button" value="Editor Mode" className="toolbar" onClick={() => {
		  setMode({mode: "editorMode"});
		  setItems({items: ""})
		}}/>
		<input type="email" name="email" class="textinput" onChange={myEmailReceiverChangeHandler}></input>
		<input type="button" value="Send Invite" className="toolbar" onClick={sendMail}></input>
		</div>
			</>
		  );
}
  return (
    <>
<div class="mainDiv">
        {/**Toolbar buttons*/}
  <div class="navbar">
          <ul>
      <button data-testid="getMyDocs" value="My docs" className="toolbar" onClick={getUsersDocsGraphQL}>My docs</button>
          </ul>
      </div>
  <div class="toolbarDiv">
           <label>Namn: </label>
            <input type="text" name="nameArea" class="textinput" placeholder={item.name} onChange={myNameChangeHandler}/>
            <input type="button" value="Run code" className="toolbar" onClick={runCode}/>
            <input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={updateDoc}/>
            <input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={createNewDoc}/>
  </div>
  <div class="editorDiv">
  <CodeMirror
    value={item.content}
    onChange={updateCode}
    options={options} 
    />
  </div>
  <input type="button" value="Editor Mode" className="toolbar" onClick={() => {
          setMode({mode: "editorMode"});
          //console.log(code)
		  setItems({items: ""})
        }}/>
        <input type="email" name="email" class="textinput" onChange={myEmailReceiverChangeHandler}></input>
        <input type="button" value="Send Invite" className="toolbar" onClick={sendMail}></input>
</div>
    </>
  );
}

    ///
    ///
    ///
    /// Editor mode
    ///
    ///
    ///
if (mode.mode === "editorMode") {


if (items.length > 0) {
	
		return (
				<>
				<div class="mainDiv">
					{/**Toolbar buttons*/}
					
					<div class="navbar">
					<ul>
					<h2 data-testid="redigera">Redigera dokument: </h2>
					{items.map((data, key) => {
				  return (
						<button class="toolbar" onClick={() => getOneGraphQL(data._id)}>{data.name}</button>
				  );
				})}
				</ul>
				</div> 
				<div class="toolbarDiv">
				<label>Namn: </label>
						<input type="text" name="nameArea" class="textinput" placeholder={item.name} onChange={myNameChangeHandler}/>
						
						<input type="button" data-testid="save" value="Spara" className="toolbar" onClick={log}/>
						<input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={updateDoc}/>
						<input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={createNewDoc}/>
            <input type="button" data-testid="create" value="Spara som PDF" className="toolbar" onClick={saveAsPDF}/>
				</div>
						{/**<input type="button" value="Ta bort" className="toolbar" onClick={deleteDoc}/>*/}
				<div class="editorDiv">
					  <Editor
					   apiKey='epvu53yulqfg70pfagqhz9nm0914ws2h220hgu39cnwkwnxb'
						onInit={(evt, editor) => editorRef.current = editor}
						initialValue={item.content}
						onChange={myContentChangeHandler}
						init={{
						  height: 500,
						  menubar: false,
						  plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount'
						  ],
						  toolbar: 'undo redo | formatselect | ' +
						  'bold italic backcolor | alignleft aligncenter ' +
						  'alignright alignjustify | bullist numlist outdent indent | ' +
						  'removeformat | help',
						  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
						}}
					/>
          	</div>
            <input type="button" value="Code Mode" className="toolbar" onClick={() => {
              setMode({mode: "codeMode"});
			  setItems({items: ""})
              
            }}/>
            <input type="email" name="email" class="textinput" onChange={myEmailReceiverChangeHandler}></input>
            <input type="button" value="Send Invite" className="toolbar" onClick={sendMail}></input>
			{console.log(contentList)}
			
			{contentList}
			
			</div>
				</>
			  );
	}
    return (
        <>
		<div class="mainDiv">
            {/**Toolbar buttons*/}
			<div class="navbar">
            	<ul>
					<button data-testid="getMyDocs" value="My docs" className="toolbar" onClick={getUsersDocsGraphQL}>My docs</button>
            	</ul>
        	</div>
			<div class="toolbarDiv">
               <label>Namn: </label>
                    <input type="text" name="nameArea" class="textinput" placeholder={item.name} onChange={myNameChangeHandler}/>
                
                <input type="button" data-testid="save" value="Spara" className="toolbar" onClick={log}/>
                <input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={updateDoc}/>
                <input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={createNewDoc}/>
                <input type="button" data-testid="pdf" value="Spara som PDF" className="toolbar pdf" onClick={saveAsPDF}/>
                {/**<input type="button" value="Ta bort" className="toolbar" onClick={deleteDoc}/>*/}
			</div>
			<div class="editorDiv">
              <Editor
               apiKey='epvu53yulqfg70pfagqhz9nm0914ws2h220hgu39cnwkwnxb'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={item.content}
                onChange={myContentChangeHandler}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar: 'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
				
            />
			</div>
      <input type="button" value="Code Mode" className="toolbar" onClick={() => {
              setMode({mode: "codeMode"});
              //console.log(code)
			  setItems({items: ""})
            }}/>
            <input type="email" name="email" class="textinput" onChange={myEmailReceiverChangeHandler}></input>
            <input type="button" value="Send Invite" className="toolbar invite" onClick={sendMail}></input>
		</div>
        </>
      );
	}
}
export default Toolbar;