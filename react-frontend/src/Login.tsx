import React, {useEffect, useState} from 'react';
import Backend from './resource/Drupal';
import {AxiosError} from "axios";
import logo from "./assets/logó.png"

function Login(props: { login: () => void }) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [badInputClass, setBadInputClass] = useState<string>("");
    const [badTextClass, setBadTextClass] = useState<string>("");

    const lsUsername=localStorage.getItem("username");
    const lsPassword=localStorage.getItem("password");
    if (lsUsername !== null && lsPassword !== null){
        Backend.login(lsUsername, lsPassword)
            .then(_ => {
                props.login();
            })
    }

    const keydownHandler = (e: any) => {
        if (e.key === "Enter") {
            e.preventDefault();
            login();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
        }
    });

    const login = () => {
        Backend.login(username, password)
            .then(_ => {
                props.login();
                if(rememberMe){
                    localStorage.setItem("username", username);
                    localStorage.setItem("password", password);
                }
            })
            .catch((resp: AxiosError) => {
                if (resp.response?.data.message === "Sorry, unrecognized username or password.") {
                    setBadInputClass("border-red-500");
                    setBadTextClass("text-red-500");
                }
            })
    };

    return (
        <div className="flex justify-center h-screen" style={{backgroundImage: "url('" + logo + "')", backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat"}}>

            <form className="shadow-md rounded px-8 pt-6 pb-8 m-auto text-sm sm:text-2xl" style={{backgroundColor: "rgba(200,200,200,0.9)"}}>
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
                <div className="mb-3">
                    <label className={"block text-gray-700 font-bold mb-2 " + badTextClass} htmlFor="password">
                        Jelszó
                    </label>
                    <input
                        className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline " + badInputClass}
                        id="password" type="password" placeholder="******************"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}/>
                </div>
                <div className="flex justify-center mb-3">
                    <label className="lock text-gray-500 font-bold">
                        <input className="mr-2 leading-tight" type="checkbox" onChange={(event) => setRememberMe(event.target.checked)}/>
                        <span className="text-base text-white">
                            Jegyezz meg!
                        </span>
                    </label>
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
