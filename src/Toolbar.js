import './App.css';
import React, { useEffect, useRef, useState } from "react";

import { Editor } from '@tinymce/tinymce-react';
import socketIOClient from "socket.io-client";

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
    const editorRef = useRef(null);
	
	  const user = props.user;
	  const token = props.token
    // Functions for interacting with editor"
    socket.on("doc", (data) => {
      if (editorRef.current) {
        editorRef.current.setContent(data.content);
      }
    });
    function log() {
      let myContent = "";
      if (editorRef.current) {
        console.log(editorRef.current.getContent());
        myContent = editorRef.current.getContent();
      }
      return myContent;
    };
  
    /*useEffect(() => {
        //fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor/" + user)
        let body = {
          "valid_users": [user, "admin@admin.se"]
      }
        fetch("http://localhost:1337/userDocs", )
          .then(res => res.json())
          .then(
            (result) => {
              if (result.errors) {
                  alert("User has no docs yet!")
              } else {
                setIsLoaded(true);
                setItems(result);
              }
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])*/
	function getUsersDocsGraphQL() {
		let GraphQLQuery = { query: '{ Usersdoc(user: "' + user + '") { name, content, valid_users, _id } }' }
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
	function getUsersDocs() {
        let body = {
            "user": user
        }
        let url = "https://jsramverk-editor-jopt19.azurewebsites.net/userDocs"
        //let url = "http://localhost:1337/userDocs"
        fetch(url, {
            method: 'POST',
            headers: {"Content-type": 'application/json', "x-access-token": token},
            body: JSON.stringify(body)
        }).then(res => res.json())
		.then(
          (result) => {
            if (result.errors) {
              	alert(result.errors.title)
          	} else if (result.userDocs) {
            	setIsLoaded(true);
            	setItems(result.userDocs);
        	} else {
				//alert(error)
				setError(error);
			}
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )}

    function createNewDoc() {
        let body = {
              "content": content.content,
              "name": name.name,
              "valid_users": [user, "admin@admin.se"]
        }
        let url = "https://jsramverk-editor-jopt19.azurewebsites.net/editor"
        //let url = "http://localhost:1337/editor"
        fetch(url, {
            method: 'POST',
            headers: {"Content-type": 'application/json', "x-access-token": token},
            body: JSON.stringify(body)
        }).then(response => {
          	alert("Document created");
			      getUsersDocs();
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

    function deleteDoc(){

        var id = window.location.pathname;
        id = id.substring(8);
        let body = {
            "id": id
        }
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor", {
          method: 'DELETE',
          body: JSON.stringify(body),
          headers: {"Content-type": 'application/json'},
        }).then(response => {
            window.location.pathname.replace("");
        })
    }
    function updateDoc() {
        let body = {
            "id": item._id,
            "content": content.content,
            "name": name.name,
            "valid_users": [user, "admin@admin.se"]
        }
		console.log(body)
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor", {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {"Content-type": 'application/json', "x-access-token": token},
        }).then(response => {
			getUsersDocs()
        })
    }

    function getOneGraphQL(id) {
		let GraphQLQuery = { query: '{ OneDoc(id: "' + id + '") { _id, name, content } }' }
		//console.log(GraphQLQuery)
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
          	console.log(result.data.OneDoc.name)
          	setName({name: result.data.OneDoc.name});
          	setItem(result.data.OneDoc);
			console.log(item)
        	},
        	(error) => {
          	setIsLoaded(true);
          	setError(error);
        	}
      	)
	}
    function getOneDoc(id){
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor/" + id)
        //fetch("http://localhost:1337/editor/" + id)
          .then(res => res.json())
          .then(
            (result) => {
              socket.emit("create", id);
              setIsLoaded(true);
              console.log(result)
              setName({name: result.name});
              setItem(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
    }
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
		</div>
        </>
      );
	
}
export default Toolbar;