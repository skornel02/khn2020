import React, {useState} from 'react';
import Login from "./Login";
import Main from "./Main";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const switchToMain = () => {
        setRender(<Main logout={switchToLogin}/>)
    };

    const switchToLogin = () => {
        setRender(<Login login={switchToMain}/>)
    };

    const [render, setRender] = useState(<Login login={switchToMain}/>);

    return (
        <>
            <ToastContainer />
            {render}
        </>
    );
}

export default App;