import React, {useState} from 'react';
import Login from "./Login";
import Main from "./Main";

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
            {render}
        </>
    );
}

export default App;