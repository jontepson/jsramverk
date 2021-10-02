
import './App.css';
import React, { useEffect, useRef, useState } from "react";

// Toolbar eller ett inloggningsformulär
function Login() {
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [token, setToken] = useState([]);
    function myEmailChangeHandler(event) {
        // Works
        setEmail({email: event.target.value});
      }
    function myPasswordChangeHandler(event) {
      // onChange letar efter event, t.ex enter fungerar.
      //Works
        setPassword({password: event.target.value});
    }

    function userLogin() {
        // check if user in database and login if he should have access
        // lägga in i backend en möjlighet att logga in och signup
        // ändra alla getdb till att ta ett argument för vilken collection vi ska jobba med.
        let body = {
            "email": email.email,
            "password": password.password
        }
        fetch("http://localhost:1337/login", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-type": 'application/json'},
        })
          .then(res => res.json())
          .then(
            (result) => {
                setToken(result.data.token)
            },
            (error) => {
              console.log(error)
            }
          )
        // RESETS PASSWORD AND EMAIL
        //setPassword({password: ""});
        //setEmail({email: ""});
    }

    function userSignUp() {
        // create a new user in database
        // kryptera lösenord först.
            // spara lösenord i databasen.
            let body = {
                "email": email.email,
                "password": password.password
            }
            let url = "http://localhost:1337/signup"
          
            fetch(url, {
                method: 'POST',
                headers: {"Content-type": 'application/json'},
                body: JSON.stringify(body)
            }).then(response => {
                window.location.reload();
                response.json(204)
            })
            // RESETS PASSWORD AND EMAIL
            //setPassword({password: ""});
            //setEmail({email: ""});
    }
  return (
    <>
            <label for="email">Email:</label>
            <br></br>
            <input type="email" name="email" onChange={myEmailChangeHandler}></input>
            <br></br>
            <label for="password">Password:</label>
            <br></br>
            <input type="password" name="password" onChange={myPasswordChangeHandler}></input>
            <br></br>
            <input type="button" data-testid="userLogin" value="Login" className="Login" onClick={userLogin}/>
            <input type="button" data-testid="userSignup" value="Signup" className="Login" onClick={userSignUp}/>
   </>
  );
}
export default Login ;
