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

class ToolbarClass extends React.Component {
  	constructor(props) {
    super(props);
    //creates variables needed, use this.state.variable
    this.state = {
        mode: "editorMode",
		items: [],
		item: ""
    }
    // make this.setState available in function
	this.handleEditorChange = this.handleEditorChange.bind(this);
	this.myNameChangeHandler = this.myNameChangeHandler.bind(this);
	this.myEmailReceiverChangeHandler = this.myEmailReceiverChangeHandler.bind(this);
	this.sendMail = this.sendMail.bind(this);
	this.log = this.log.bind(this);
	this.getUsersDocsGraphQL = this.getUsersDocsGraphQL.bind(this);
	this.updateCode = this.updateCode.bind(this);
	this.getOneGraphQL = this.getOneGraphQL.bind(this);
	this.createNewDoc = this.createNewDoc.bind(this);
	this.saveAsPDF = this.saveAsPDF.bind(this);
	//const editorRef = useRef(null);
	
    if(!this.state.mode) {
      	this.setState({mode: "editorMode"})
    };
	
    socket.on("doc", (data) => {
      if (this.state.editorContent) {
			Editor.activeEditor.setContent(data.content);
      }
    });
  	}

  	///
	///
	/// HANDLERS
	///
	///
  	handleEditorChange = (e) => {
    //console.log('Content was updated:', e.target.getContent());
	this.setState({editorContent: e.target.getContent()})
	/*
	let body = {
		"id": item._id,
		"content": content.content,
		"name": name.name
	  }
	  socket.emit("doc", body);*/
  	}

  	myNameChangeHandler = (event) => {
	this.setState({name: event.target.value});
  	}

  	myEmailReceiverChangeHandler = (event) => {
	this.setState({receiver: event.target.value});
	}

	//SEND MAIL
    sendMail = (receiver, item) => {
      const msg = {
        to: receiver,
        from: 'jopt19@hackermail.com',
        subject: 'Invite to edit my document',
        text: 'Welcome to edit my document at https://www.student.bth.se/~jopt19/editor/',
        html: '<strong>Welcome to edit my document at https://www.student.bth.se/~jopt19/editor/</strong>',
      };
	  let validusersList;
	  if(item) {
			validusersList = item.valid_users;
			validusersList.push(receiver);
	  } else {
		  	validusersList = [receiver, "admin@admin.se"]
	  }
      
      
      fetch("https://jsramverk-editor-jopt19.azurewebsites.net/invite", {
            method: 'POST',
            body: JSON.stringify(msg),
            headers: {"Content-type": 'application/json'}
        }).then(res => {
          console.log("Invite send");
        }),
		(error) => {
		  console.log(error)
		}
        let body = {
          "id": item._id,
          "content": item.content,
          "name": item.name,
          "valid_users": validusersList
        }
        //console.log(body)
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor", {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: {"Content-type": 'application/json', "x-access-token": this.state.token},
        }).then(response => {
          alert(receiver + " now has access to this doc")
      }),
	  (error) => {
		console.log(error)
	  }
    }
	//LOG EDITORCONTENT IN CONSOLE
	log = (editorContent) => {
		let myContent = "";
		if (editorContent) {
		  myContent = editorContent
		  console.log(editorContent)
		}
		return myContent;
	  };

	//API 
	getUsersDocsGraphQL = (user, mode, token) => {
		//console.log(user, mode, token)
		let GraphQLQuery = { query: '{ Usersdoc(user: "' + user + '", mode: "' + mode + '") { name, content, valid_users, _id } }' }
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
			//console.log(result.data)
			//setItems(result.data.Usersdoc);
			if(result.data) {
				this.setState({items: result.data.Usersdoc});
			}
		  	//console.log(items)
			},
		  (error) => {
			console.log(error)
		  }
		)
	}

	updateDoc = (item, token, editorContent, docName, mode, user) => {
	
		let validusersList = item.valid_users
		if (!validusersList.includes("admin@admin.se")) {
		  validusersList.push("admin@admin.se")
		}
		  let body = {
			  "id": item._id,
			  "content": editorContent,
			  "name": docName,
			  "valid_users": validusersList,
			  "mode": mode
		  }
		  //console.log(body)
		  //fetch("http://localhost:1337/editor", {
		  fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor", {
			  	method: 'PUT',
			  	body: JSON.stringify(body),
			  	headers: {"Content-type": 'application/json', "x-access-token": token},
		  }).then(response => {
			  	this.getUsersDocsGraphQL(user, mode, token)
		  }),
		  (error) => {
			console.log(error)
		  }
	}

	getOneGraphQL = (id, token) => {
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
          	//console.log(result.data.OneDoc.valid_users)
          	this.setState({name: result.data.OneDoc.name});
			this.setState({content: result.data.OneDoc.content})
          	this.setState({item: result.data.OneDoc});
			let contentList = result.data.OneDoc.content.split("\n").map((item) =>
  				<li>{item}</li>
				);
			this.setState(contentList)
			 // console.log(item)
        	},
        	(error) => {
          	console.log(error)
        	}
      	)
	}

	createNewDoc = (content, name, user, mode, token) => {
        let body = {
              "content": content,
              "name": name,
              "valid_users": [user, "admin@admin.se"],
              "mode": mode
        }
		//console.log(body)
		//console.log(body)
        let url = "https://jsramverk-editor-jopt19.azurewebsites.net/editor"
		
        //let url = "http://localhost:1337/editor"
        fetch(url, {
            method: 'POST',
            headers: {"Content-type": 'application/json', "x-access-token": token},
            body: JSON.stringify(body)
        }).then(response => {
          	alert("Document created");
			this.getUsersDocsGraphQL(user, mode, token);
          	response.json(204);
        }),
		(error) => {
		  console.log(error)
		}
    }

	///
	/// Function to save as pdf, all in frontend using jsPDF
	/// 
	saveAsPDF = (editorContent, docName) => {
		//console.log(editorContent, docName)
		const doc = new jsPDF();
		//console.log(content.content)
		//console.log(name.name)
		doc.html(editorContent, {
		  callback: function (doc) {
			doc.save(docName + ".pdf");
		  }
	   });
	}

	///
    ///
    ///
    /// CODE MODE FUNCTIONS
    ///
    ///
    ///
	updateCode = (newCode) => {
		this.setState({content: newCode});
    }

	runCode = (content, item) => {
		if(!content && !item) {
			content = "console.log('Welcome to the code editor');"
		}
		if (!content) {
			this.setState({content: item.content})
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

	
	///
    ///
    ///
    /// RENDER CODEMODE 
    ///
    ///
    ///

	render() {
	///
    ///
    ///
    /// RENDER CODEMODE 
    ///
    ///
    ///
		if (this.state.mode === "codeMode") {
			var options = {
			  lineNumbers: true,
			  autoRefresh: true,
			  mode: "javascript",
			  value: "console.log('Welcome to the code editor');"
			};
			if (this.state.items.length > 0) {
				//console.log(this.state.item)
			  	return (
					  	<>
						<div className="mainDiv">
						  {/**Toolbar buttons*/}
						  
						  	<div className="navbar">
						  		<ul>
						  			<h2 data-testid="redigera">Redigera dokument: </h2>
						  			{this.state.items.map((data, key) => {
										return (
							  				<button className="toolbar" onClick={() => this.getOneGraphQL(data._id, this.props.token)}>{data.name}</button>
										);
					 				 })}
					  			</ul>
					  		</div> 
					  	<div className="toolbarDiv">
					  		<label>Namn: </label>
							  	<input type="text" name="nameArea" className="textinput" placeholder={this.state.item.name} onChange={this.myNameChangeHandler}/>
							  	<input type="button" value="Run code" className="toolbar" onClick={() => this.runCode(this.state.content)}/>
							  	<input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={() => this.updateDoc(this.state.item, this.props.token, this.state.content, this.state.name, this.state.mode, this.props.user)}/>
							  	<input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={() => this.createNewDoc(this.state.content, this.state.name, this.props.user, this.state.mode, this.props.token)}/>
						  		{/**<input type="button" data-testid="create" value="Spara som PDF" className="toolbar" onClick={saveAsPDF}/>*/}
					  	</div>
							  {/**<input type="button" value="Ta bort" className="toolbar" onClick={deleteDoc}/>*/}
						<div className="editorDiv">
							<CodeMirror
					  			value="something else"
					  			onChange={this.updateCode}
					 		 	options={options}
					  			/>
						</div>
				  			<input type="button" value="Editor Mode" className="toolbar" onClick={() => {
								this.setState({mode: "editorMode"});
								this.setState({items: ""})
				  			}}/>
				  			<input type="button" value="Send Invite" className="toolbar" onClick={() => this.sendMail(this.state.receiver, this.state.item)}></input>
							<input type="email" name="email" className="textinput" onChange={this.myEmailReceiverChangeHandler}></input>
				  		</div>
					  	</>
				);
		  	}
			return (
			  	<>
		  		<div className="mainDiv">
				  	{/**Toolbar buttons*/}
					<div className="navbar">
						<ul>
							<button data-testid="getMyDocs" value="My docs" className="toolbar" onClick={() => this.getUsersDocsGraphQL(this.props.user, this.state.mode, this.props.token)}>My docs</button>
						</ul>
					</div>
					<div className="toolbarDiv">
					 	<label>Namn: </label>
						 	<input type="text" name="nameArea" className="textinput" onChange={this.myNameChangeHandler}/>
							<input type="button" value="Run code" className="toolbar runCode" onClick={() => this.runCode(this.state.content)}/>
						  	<input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={() => this.updateDoc(this.state.item, this.props.token, this.state.content, this.state.name, this.state.mode, this.props.user)}/>
						  	<input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={() => this.createNewDoc(this.state.content, this.state.name, this.props.user, this.state.mode, this.props.token)}/>
					</div>
					<div className="editorDiv CodeMirror">
						<CodeMirror
			  				value="console.log('Welcome to the code editor');"
			  				onChange={this.updateCode}
			  				options={options} 
			  			/>
					</div>
					<input type="button" value="Editor Mode" className="toolbar mode" onClick={() => {
						this.setState({mode: "editorMode"});
					//console.log(code)
						this.setState({items: ""})
				  	}}/>
				  	<input type="button" value="Send Invite" className="toolbar" onClick={() => this.sendMail(this.state.receiver, this.state.item)}></input>
					  <input type="email" name="email" className="textinput" onChange={this.myEmailReceiverChangeHandler}></input>
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
		if (this.state.mode === "editorMode") {


		if (this.state.items.length > 0) {
			
			return (
					<>
					<div className="mainDiv">
						{/**Toolbar buttons*/}
							
						<div className="navbar">
							<ul>
								<h2 data-testid="redigera">Redigera dokument: </h2>
									{this.state.items.map((data, key) => {
						  				return (
											<button className="toolbar" onClick={() => this.getOneGraphQL(data._id, this.props.token)}>{data.name}</button>
						  				);
									})}
							</ul>
						</div>
						<div className="toolbarDiv">
							<label>Namn: </label>
								<input type="text" name="nameArea" className="textinput" placeholder={this.state.item.name} onChange={this.myNameChangeHandler}/>
								<input type="button" data-testid="save" value="Log" className="toolbar" onClick={() => this.log(this.state.editorContent)}/>
								<input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={() => this.updateDoc(this.state.item, this.props.token, this.state.editorContent, this.state.name, this.state.mode, this.props.user)}/>
								<input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={() => this.createNewDoc(this.state.editorContent, this.state.name, this.props.user, this.state.mode, this.props.token)}/>
								<input type="button" data-testid="PDF" value="Spara som PDF" className="toolbar" onClick={() => this.saveAsPDF(this.state.editorContent, this.state.name)}/>
						</div>
								{/**<input type="button" value="Ta bort" className="toolbar" onClick={deleteDoc}/>*/}
						<div className="editorDiv">
							  <Editor
							   apiKey='epvu53yulqfg70pfagqhz9nm0914ws2h220hgu39cnwkwnxb'
								initialValue={this.state.item.content}
								onChange={this.handleEditorChange}
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
					  		this.setState({mode: "codeMode"});
					  		this.setState({items: ""})
						}}/>
						<input type="button" value="Send Invite" className="toolbar" onClick={() => this.sendMail(this.state.receiver, this.state.item)}></input>
						<input type="email" name="email" className="textinput" onChange={this.myEmailReceiverChangeHandler}></input>
					</div>
					</>
			);
		}
			return (
				<>
				<div className="mainDiv">
					{/**Toolbar buttons*/}
					<div className="navbar">
						<ul>
							<button data-testid="getMyDocs" value="My docs" className="toolbar" onClick={() => this.getUsersDocsGraphQL(this.props.user, this.state.mode, this.props.token)}>My docs</button>
						</ul>
					</div>
					<div className="toolbarDiv">
					   	<label>Namn: </label>
						<input type="text" name="nameArea" className="textinput" placeholder={this.state.item.name} onChange={this.myNameChangeHandler}/>
						
						<input type="button" data-testid="save" value="Log" className="toolbar" onClick={() => this.log(this.state.editorContent)}/>
						<input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={() => this.updateDoc(this.state.item, this.props.token, this.state.editorContent, this.state.name, this.state.mode, this.props.user)}/>
						<input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={() => this.createNewDoc(this.state.editorContent, this.state.name, this.props.user, this.state.mode, this.props.token)}/>
						<input type="button" data-testid="PDF" value="Spara som PDF" className="toolbar pdf" onClick={() => this.saveAsPDF(this.state.editorContent, this.state.name)}/>
						{/**<input type="button" value="Ta bort" className="toolbar" onClick={deleteDoc}/>*/}
					</div>
					<div className="editorDiv Editor">
					  <Editor
					   	apiKey='epvu53yulqfg70pfagqhz9nm0914ws2h220hgu39cnwkwnxb'
						initialValue={this.state.item.content}
						onChange={this.handleEditorChange}
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
			  <input type="button" value="Code Mode" className="toolbar mode" onClick={() => {
					  this.setState({mode: "codeMode"});
					  //console.log(code)
					  this.setState({items: ""})
					}}/>
					<input type="button" value="Send Invite" className="toolbar invite" onClick={() => this.sendMail(this.state.receiver, this.state.item)}></input>
					<input type="email" name="email" className="inviteTextField" placeholder="Email" onChange={this.myEmailReceiverChangeHandler}></input>
				</div>
				</>
			  );
		}

	}

}

export default ToolbarClass;