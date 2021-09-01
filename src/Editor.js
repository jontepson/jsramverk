import React, { useRef } from 'react';
 import { Editor } from '@tinymce/tinymce-react';



function App() {
   const editorRef = useRef(null);
   function log() {
     if (editorRef.current) {
       var myContent = editorRef.current.getContent();
     }
     console.log(myContent);
     return myContent;
   };
   return (
     <>
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
       <button onClick={log}>Log editor content</button>
     </>
    
   );
 }
 export default App;
 