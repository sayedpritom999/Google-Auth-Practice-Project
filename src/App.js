import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase/app';
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  });
 
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {photoURL, displayName, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
    })
    .catch(err => {
      console.log(err)
      console.log(err.message)
    })
    
  };
  
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        isValid: false,
        existingUser: false
      }; setUser(signedOutUser);
    })
    .catch(err => {
      console.log(err.message)
    })
  }


  const is_valid_email = email =>  /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = event => {
    const createdUser = {...user};
        createdUser.existingUser = event.target.checked;
        setUser(createdUser)
  }


  const printChange = event => {
    const newUser = {...user};
    
    // perform validation
    let isValid = true;
    if(event.target.name === "email") {
      isValid = is_valid_email(event.target.value)
    }
    if(event.target.name === "password") {
      isValid = (event.target.value).length > 8 && hasNumber(event.target.value);
    }

    newUser[event.target.name] = event.target.value;
    newUser.isValid = isValid;
    setUser(newUser);
  }

  const createAccount = (event) => {
    if(user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser)
      })
      .catch(err => {
        console.log(err.message)
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser)
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    if(user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser)
      })
      .catch(err => {
        console.log(err.message)
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser)
      })
    }
    event.preventDefault();
    event.target.reset()
  }
  return (
    <div className="App">
      {user.isSignedIn ? <button onClick= {handleSignOut}>Sign Out</button>: 
      <button onClick= {handleSignIn}>Sign In</button> } 
      {
        user.isSignedIn && <div>
          <p>Welcome {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
    }
    <h1>Our own authentication</h1>
    <input type="checkbox" name="switchForm" onChange = {switchForm} id = "switchForm"/>
    <label htmlFor="switchForm"> Returning User</label>
    <form style = {{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
      <input type="text" name = "email" onBlur = {printChange} placeholder = "Your Email" required/>
      <br/>
      <input type="text" name="password" id="" onBlur = {printChange} placeholder = "Your Password" required/>
      <br/>
      <input type="submit" value = "SignIn"/>
    </form>
    <form style = {{display: user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
      <input type="text" name = "name" onBlur = {printChange} placeholder = "Your Name" required/>
      <br/>
      <input type="text" name = "email" onBlur = {printChange} placeholder = "Your Email" required/>
      <br/>
      <input type="text" name="password" id="" onBlur = {printChange} placeholder = "Your Password" required/>
      <br/>
      <input type="submit" value = "Create Account"/>
    </form>
    {
      user.error && <p style = {{color: 'red'}}>{user.error}</p>
    }
    </div>
  );
}

export default App;
