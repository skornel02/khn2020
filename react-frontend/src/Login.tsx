import React from 'react';

function Login(props: {login: () => void}) {
    return (
        <div className="flex justify-center h-screen">
        <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 m-auto text-sm sm:text-2xl">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                    Felhasználónév
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username" type="text" placeholder="Felhasználónév"/>
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                    Jelszó
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password" type="password" placeholder="******************"/>
            </div>
            <div className="flex justify-center">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button" onClick={props.login}>
                    Bejelentkezés
                </button>
            </div>
        </form>
        </div>
    );
}

export default Login;
