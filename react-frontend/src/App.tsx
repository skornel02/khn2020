import React, {useState} from 'react';
import Login from "./Login";
import Main from "./Main";

const App = () => {
    const switchToMain = () => {
        setRender(<Main/>)
    };

    const [render, setRender] = useState(<Login login={switchToMain}/>);

    return (
        <>
            {render}
        </>
    );
};

export default App;