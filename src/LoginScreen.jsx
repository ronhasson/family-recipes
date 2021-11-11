import "./loginScreen.css";
import googleIcon from "./img/google.svg";
import enterIcon from "./img/enter.svg";
import bellIcon from "./img/bell.svg";
import { useState } from "react";

function LoginScreen() {
    const [showReg, setShowReg] = useState(false);


    return (
        <div className="loginContainer">
            {!showReg &&
                <div className="loginscreen">
                    <h1>Login</h1>
                    <div className="loginSec">
                        <button><img src={googleIcon} alt="google" />Login with Google</button>
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
                    <h1>Sign-up</h1>
                    <div className="regSec">
                        <button><img src={googleIcon} alt="google" />Sign-up with Google</button>
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
    );
}

export default LoginScreen;