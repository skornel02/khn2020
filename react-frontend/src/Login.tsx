import React, {useState} from 'react';
import Backend from './resource/Drupal';
import {AxiosError} from "axios";

function Login(props: { login: () => void }) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [badInputClass, setBadInputClass] = useState<string>("");
    const [badTextClass, setBadTextClass] = useState<string>("");

    const login = () => {
        Backend.login(username, password)
            .then(resp => {
                props.login();
            })
            .catch((resp: AxiosError) => {
                if (resp.response?.data.message === "Sorry, unrecognized username or password.") {
                    setBadInputClass("border-red-500");
                    setBadTextClass("text-red-500");
                }
            })
    }

    return (
        <div className="flex justify-center h-screen">

            <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 m-auto text-sm sm:text-2xl">
                {badInputClass + badTextClass !== "" ?
                    <p className="text-base text-red-500 mb-6 text-center font-bold">Helytelen jelszó, vagy
                        felhasználónév!</p> : null}

                <div className="mb-4">
                    <label className={"block text-gray-700 font-bold mb-2 " + badTextClass} htmlFor="username">
                        Felhasználónév
                    </label>
                    <input
                        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " + badInputClass}
                        id="username" type="text" placeholder="Felhasználónév"
                        onChange={(event) => setUsername(event.target.value)}
                        value={username}/>
                </div>
                <div className="mb-6">
                    <label className={"block text-gray-700 font-bold mb-2 " + badTextClass} htmlFor="password">
                        Jelszó
                    </label>
                    <input
                        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline " + badInputClass}
                        id="password" type="password" placeholder="******************"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}/>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" onClick={login}>
                        Bejelentkezés
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
