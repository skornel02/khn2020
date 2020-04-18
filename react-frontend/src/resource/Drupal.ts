import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {DrupalLogin, DrupalLoginResult} from "./Types";

const SERVER_ADDR = "https://versenydonto.nisz.hu:10016";

export enum UserRole {
    Anon,
    Parent,
    Kid,
    Grandma
}

class DrupalConnection {
    loginStatus: UserRole = UserRole.Anon;
    backend: DrupalBackend = new DrupalBackend(undefined);

    login = (username: String, password: String) => {
        console.log("asd");
        this.backend.login(username, password);
    };

    logout = () => {

    }

}

class DrupalBackend {
    private axios: AxiosInstance;

    constructor(credentials: {username: string, password: string} | undefined) {
        const axiosConfig: AxiosRequestConfig = {
            baseURL: SERVER_ADDR,
        };

        if (credentials !== undefined) {
            axiosConfig.auth = {
                username: credentials.username,
                password: credentials.password,
            }
        }
        this.axios = axios.create(axiosConfig);
    }

    login = async (username: String, password: String): Promise<DrupalLogin> => {
        return this.axios.post<DrupalLoginResult>("/user/login?_format=hal_json", {
            name: username,
            pass: password
        })
            .then(result => {
                const formed: DrupalLogin = {
                    id: result.data.current_user.uid,
                    username: result.data.current_user.name,
                    roles: result.data.current_user.roles ?? [],
                    csrfToken: result.data.csrf_token,
                    logoutToken: result.data.logout_token,
                };
                return formed;
            });
    }

}

export default new DrupalConnection();