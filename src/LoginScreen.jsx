import "./loginScreen.css";
import googleIcon from "./img/google.svg";
import enterIcon from "./img/enter.svg";
import bellIcon from "./img/bell.svg";
import { auth } from "./firebase.js";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useState } from "react";

function LoginScreen() {
    const [showReg, setShowReg] = useState(false);

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
                            <div>
                                <input type="text" id="loginEmail" placeholder="Email" />
                                <input type="password" id="loginPassword" placeholder="Password" />
                                <button><img src={enterIcon} alt="google" />Lets cook!</button>
                            </div>
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
                            <div>
                                <input type="text" id="regEmail" placeholder="Email" />
                                <input type="text" id="regFirstname" placeholder="First name" />
                                <input type="text" id="regLastname" placeholder="Last name" />
                                <input type="password" id="regPassword" placeholder="Password" />
                                <input type="password" id="regPassword2" placeholder="Password again" />
                                <button><img src={bellIcon} alt="google" />Done.</button>
                            </div>
                            <button onClick={() => { setShowReg(false) }}>I already have an account</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default LoginScreen;