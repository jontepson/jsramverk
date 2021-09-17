import './App.css';
import React, { useEffect, useRef, useState } from "react";

import { Editor } from '@tinymce/tinymce-react';




function Toolbar() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [item, setItem] = useState([]);
    const [name, setName] = useState([]);
    const [content, setContent] = useState([]);
    const editorRef = useRef(null);
    // Functions for interacting with editor¨
    
    function log() {
      let myContent = "";
      if (editorRef.current) {
        console.log(editorRef.current.getContent());
        myContent = editorRef.current.getContent();
      }
      return myContent;
    };

    // GET all docs
    
    useEffect(() => {
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setItems(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])

    function createNewDoc() {
        let body = {
            "content": content.content,
            "name": name.name
        }
        let url = "https://jsramverk-editor-jopt19.azurewebsites.net/editor"
        
        fetch(url, {
            method: 'POST',
            headers: {"Content-type": 'application/json'},
            body: JSON.stringify(body)
        }).then(response => {
          window.location.reload();
          response.json(204)
        })
          
    }
    function myNameChangeHandler(event) {
        setName({name: event.target.value});
        
      }

      function myContentChangeHandler() {
        var EditorContent = editorRef.current.getContent()
        setContent({content: EditorContent});
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
            "name": name.name
        }
      
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor", {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {"Content-type": 'application/json'},
        }).then(response => {
            window.location.reload();
        })
    }
    function getOneDoc(id){
        fetch("https://jsramverk-editor-jopt19.azurewebsites.net/editor/" + id)
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setItem(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
    }
    
    return (
        <>
            
            {/**Toolbar buttons*/}
            
            <h2 data-testid="redigera">Redigera dokument: </h2>
            {items.map((data, key) => {
          return (
              <div key={key}>
                  <button onClick={() => getOneDoc(data._id)}>{data.name}</button>
              </div>
          );
        })}     <label>Namn: </label>
                    <input type="text"
                    placeholder={item.name}
                    onChange={myNameChangeHandler}
                    />
                
                <input type="button" data-testid="save" value="Spara" className="toolbar" onClick={log}/>
                <input type="button" data-testid="update" value="Uppdatera" className="toolbar" onClick={updateDoc}/>
                <input type="button" data-testid="create" value="Skapa" className="toolbar" onClick={createNewDoc}/>
                {/**<input type="button" value="Ta bort" className="toolbar" onClick={deleteDoc}/>*/}
            
            
              <Editor
               apiKey='epvu53yulqfg70pfagqhz9nm0914ws2h220hgu39cnwkwnxb'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={item.content}
                onSelectionChange={myContentChangeHandler}
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
        </>
      );
}
export default Toolbar;