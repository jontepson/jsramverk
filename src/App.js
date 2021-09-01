
import './App.css';
import React, { useRef } from "react";
/*import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
*/
import Header from './layout/header';
import Footer from './layout/footer';
//import Toolbar from './layout/Toolbar';
import { Editor } from '@tinymce/tinymce-react';


function App() {
  const editorRef = useRef(null);
  // Functions for interacting with editor
  function log() {
    let myContent = "";
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      myContent = editorRef.current.getContent();
    }
    return myContent;
  };
  
  
  return (
    <>
     
    {/**<Router>
      <div>
        <Toolbar />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        {/*<Switch>
          <Route path="/about">
          </Route>
          <Route path="/">
          </Route>
        </Switch>
      </div>
    </Router>*/}
    <Header />
    {/**Toolbar buttons  */}
    <button className="toolbar" onClick={log}>Spara</button>
      <Editor
       apiKey='epvu53yulqfg70pfagqhz9nm0914ws2h220hgu39cnwkwnxb'
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue="<p>This is the initial content of the editor.</p>"
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
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        
      />
      <Footer />
    </>
   
  );
}
export default App;
