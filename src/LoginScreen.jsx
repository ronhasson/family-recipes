import "./loginScreen.css";
import googleIcon from "./img/google.svg";
import enterIcon from "./img/enter.svg";
import bellIcon from "./img/bell.svg";
import { auth } from "./firebase.js";
import { GoogleAuthProvider, signInWithRedirect, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';



function LoginScreen() {
    const [showReg, setShowReg] = useState(false);
    const [inputs, setInputs] = useState({});
    const MySwal = withReactContent(Swal)

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleSubmitReg = (event) => {
        event.preventDefault();
        if (inputs.password !== inputs.password2) {
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: "Passwords do not match"
            });
            return false;
        }
        createUserWithEmailAndPassword(auth, inputs.email, inputs.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: `${inputs.fname}`
                }).then(() => {
                    // Profile updated!
                    // ...
                }).catch((error) => {
                    MySwal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error
                    });
                });
                // ...
            })
            .catch((error) => {
                //const errorCode = error.code;
                const errorMessage = error.message;
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage
                });
                // ..
            });
    }
    const handleSubmitLogin = (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, inputs.email, inputs.password)
            .then((userCredential) => {
                // Signed in 
                //const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                //const errorMessage = error.message;
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorCode
                });
                console.log(error.message);
                // ..
            });
    }

    function googleSignIn() {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);/*
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = provider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                // const email = error.email;
                // // The AuthCredential type that was used.
                // const credential = provider.credentialFromError(error);
                // // ...
            });*/
    }



    return (
        <div className="notApp">
            <div className="loginContainer">
                {!showReg &&
                    <div className="loginscreen">
                        <h1 className="loginH1">Login</h1>
                        <div className="loginSec">
                            <button onClick={() => { googleSignIn() }}><img src={googleIcon} alt="google" />Login with Google</button>
                            <span>or</span>
                            <form onSubmit={handleSubmitLogin} className="inputs">
                                <input type="email" required name="email" id="loginEmail" placeholder="Email" value={inputs.email || ""} onChange={handleChange} />
                                <input type="password" required name="password" id="loginPassword" placeholder="Password" value={inputs.password || ""} onChange={handleChange} />
                                <button><img src={enterIcon} alt="google" />Lets cook!</button>
                            </form>
                            <button onClick={() => { setShowReg(true) }}>Dont have an account?</button>
                        </div>
                    </div>
                }
                {showReg &&
                    <div className="loginscreen">
                        <h1 className="loginH1">Sign-up</h1>
                        <div className="regSec">
                            <button onClick={googleSignIn}><img src={googleIcon} alt="google" />Sign-up with Google</button>
                            <span>or</span>
                            <form onSubmit={handleSubmitReg} className="inputs">
                                <input type="email" required name="email" id="regEmail" placeholder="Email" value={inputs.email || ""} onChange={handleChange} />
                                <input type="text" required name="fname" id="regFirstname" placeholder="Full name" value={inputs.fname || ""} onChange={handleChange} />                                <input type="password" required name="password" id="regPassword" placeholder="Password" value={inputs.password || ""} onChange={handleChange} />
                                <input type="password" required name="password2" id="regPassword2" placeholder="Password again" value={inputs.password2 || ""} onChange={handleChange} />
                                <button><img src={bellIcon} alt="bell" />Done.</button>
                            </form>
                            <button onClick={() => { setShowReg(false) }}>I already have an account</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default LoginScreen;