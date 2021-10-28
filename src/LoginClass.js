
import './App.css';
import React, { useEffect, useRef, useState } from "react";
import Toolbar from './Toolbar.js';
import ToolbarClass from './ToolbarV2';
//import { ToolbarClass }from './ToolbarClass';
//url for local or production

class LoginClass extends React.Component {
    constructor(props) {
        super(props);
        //creates variables needed, use this.state.variable
        this.state = {
            token: "",
            email: "",
            password: "",
            user: ""
        }
        // make this.setState available in function
        this.myEmailChangeHandler = this.myEmailChangeHandler.bind(this)
        this.myPasswordChangeHandler = this.myPasswordChangeHandler.bind(this)
        this.userSignUp = this.userSignUp.bind(this)
        this.userLogin = this.userLogin.bind(this)
    }

    /// not in use
    getToken() {
        return this.state.token
    }
    //not in use
    getEmail() {
        return this.state.user
    }


    ///
    ///
    /// HANDLERS
    ///
    ///
    myEmailChangeHandler(event) {
        this.setState({email: event.target.value});
    }
    myPasswordChangeHandler(event) {
        this.setState({password: event.target.value});
    }

    userSignUp() {
        // create a new user in database
        // kryptera lösenord först.
        // spara lösenord i databasen.
            let body = {
                "email": this.state.email,
                "password": this.state.password
            }
            //let url = "http://localhost:1337/signup";
            let url = "https://jsramverk-editor-jopt19.azurewebsites.net/signup";
              
            fetch(url, {
                method: 'POST',
                headers: {"Content-type": 'application/json'},
                body: JSON.stringify(body)
            }).then(response => {
                window.location.reload();
                response.json(204)
            })
    }

    userLogin() {
        // check if user in database and login if he should have access
        // lägga in i backend en möjlighet att logga in och signup
        // ändra alla getdb till att ta ett argument för vilken collection vi ska jobba med.
        let body = {
            "email": this.state.email,
            "password": this.state.password
        }
        //let url = "http://localhost:1337/login";
        let url = "https://jsramverk-editor-jopt19.azurewebsites.net/login"
        fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {"Content-type": 'application/json'},
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.errors) {
                    alert(result.errors.title, result.errors.detail)
                } else {
                    this.setState({token: result.data.token})
                    this.setState({user: result.data.user.email})
                }
            },
            (error) => {
                console.log(error)
            }
        )
            // RESETS PASSWORD AND EMAIL
            //setPassword({password: ""});
            //setEmail({email: ""});
        }

    
    render() {

        /// If login is success change view
        if (this.state.token !== "" && this.state.user !== "") {
            <Toolbar token={this.state.token} user={this.state.user}/>
            return (
                <>
                    <ToolbarClass token={this.state.token} user={this.state.user}/>
                </>
            )
        }
        /// STARTPAGE
        return (
            <>
            <div class="mainDiv">
                    <div class="loginDiv">
                        <div class="loginForm">
                        <h1> Log in to get started!</h1>
                        <label for="email">Email:</label>
                        <br></br>
                        <input type="email" name="email" class="textinput" onChange={this.myEmailChangeHandler}></input>
                        <br></br>
                        <label for="password">Password:</label>
                        <br></br>
                        <input type="password" name="password" class="textinput"  onChange={this.myPasswordChangeHandler}></input>
                        <br></br>
                        <input type="button" data-testid="userLogin" value="Login" className="Login" onClick={this.userLogin}/>
                        <h3>or</h3>
                        <input type="button" data-testid="userSignup" value="Signup" className="Login" onClick={this.userSignUp}/>
                        </div>
                    </div>
            </div>
                
           </>
          );
    }
}

export {LoginClass};