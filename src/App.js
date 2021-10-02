
import './App.css';
import React from "react";
import Header from './layout/header';
import Footer from './layout/footer';
import { LoginClass} from './LoginClass';

// Toolbar eller ett inloggningsformulär
function App() {
  return (
    <>
      <Header />
      <LoginClass />
        {/**Class to login, if you can log in it redirects you to editor */}
        {/**Editor and toolbar  */}
      <Footer />
      
   </>
  );
}
export default App;
