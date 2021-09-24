
import './App.css';
import React from "react";
import Header from './layout/header';
import Footer from './layout/footer';
import Toolbar from './Toolbar.js';

function App() {
  return (
    <>
      <Header />
        {/**Editor and toolbar  */}
        <Toolbar />
      <Footer />
      
   </>
  );
}
export default App;
