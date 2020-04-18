import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {
    DrupalEventRequest,
    DrupalLocation,
    DrupalLogin,
    DrupalLoginResult,
    DrupalRule, DrupalScheduleEvent,
    DrupalUser,
    DrupalUserResult,
    EventLocation, EventRequest,
    RequestStatus,
    Rule, ScheduleEvent,
    UserRole
} from "./Types";

export const SERVER_ADDR = "https://versenydonto.nisz.hu:10016";

class DrupalConnection {
    loginStatus: UserRole = UserRole.Anon;
    backend: DrupalBackend = new DrupalBackend(undefined);
    user: DrupalLogin | undefined = undefined;

    login = (username: string, password: string): Promise<void> => {
        return this.backend.doLogin(username, password)
            .then(user => {
                this.user = user;
                this.backend = new DrupalBackend({username, password});
            })
    };

    logout = () => {
        this.backend = new DrupalBackend(undefined);
    }

}

class DrupalBackend {
    private axios: AxiosInstance;

    constructor(credentials: { username: string, password: string } | undefined) {
        const axiosConfig: AxiosRequestConfig = {
            baseURL: SERVER_ADDR,
            withCredentials: false
        };

        if (credentials !== undefined) {
            axiosConfig.auth = {
                username: credentials.username,
                password: credentials.password,
            }
        }
        this.axios = axios.create(axiosConfig);
    }

    async doLogin(username: String, password: String): Promise<DrupalLogin> {
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
    };

    async getCsrfToken(): Promise<String> {
        return this.axios.get<string>("/session/token?_format=hal_json")
            .then(result => result.data);
    }

    async getUsers(): Promise<DrupalUser[]> {
        return this.axios.get<DrupalUserResult[]>("/api/users_list?_format=hal_json")
            .then(result => {
                return result.data.map(userResult => {
                    let role: UserRole = UserRole.Anon;
                    if (userResult.roles.includes("szulo")) {
                        role = UserRole.Parent;
                    } else if (userResult.roles.includes("rokon")) {
                        role = UserRole.Grandma;
                    } else if (userResult.roles.includes("gyerek")) {
                        role = UserRole.Kid;
                    }
                    const user: DrupalUser = {
                        id: userResult.uid,
                        username: userResult.username,
                        role,
                    };
                    return user;
                });
            });
    }

    async getLocations(): Promise<EventLocation[]> {
        return this.axios.get<DrupalLocation[]>("/api/location?_format=hal_json")
            .then(result => {
                return result.data.map(locationResult => {
                    const location: EventLocation = {
                        locationName: locationResult.sav_title
                    };
                    return location;
                });
            });
    }

    async getRule(): Promise<Rule[]> {
        return this.axios.get<DrupalRule[]>("/api/rule?_format=hal_json")
            .then(result => {
                return result.data.map(ruleResult => {

                    const rule: Rule = {
                        name: ruleResult.title,
                        id: parseInt(ruleResult.nid),
                        repeatRule: ruleResult.field_t_ismetlesi_szabaly,
                        startTime: ruleResult.field_t_kezdesi_ido,
                        length: parseInt(ruleResult.field_idotartam),
                        users: ruleResult.field_resztvevok.split(', ').map(idString => parseInt(idString))
                    };
                    return rule;
                });
            });
    }

    async getEventRequests(): Promise<EventRequest[]> {
        return this.axios.get<DrupalEventRequest[]>("/api/request?_format=hal_json")
            .then(result => {
                return result.data.map(requestResult => {
                    const request: EventRequest = {
                        id: parseInt(requestResult.nid),
                        status: requestResult.field_allapot,
                        type: requestResult.title,
                        description: requestResult.field_leiras,
                        creationDate: requestResult.field_letrehozasi_datum
                    };
                    return request;
                });
            });
    }

    async getScheduleEvent(): Promise<ScheduleEvent[]> {
        return this.axios.get<DrupalScheduleEvent[]>("/api/event?_format=hal_json")
            .then(result => {
                return result.data.map(eventResult => {
                    const rule: ScheduleEvent = {
                        id: parseInt(eventResult.nid),
                        type: eventResult.title,
                        comment: eventResult.field_megjegyzes,
                        repeatRule: eventResult.field_ismetlesi_szabaly,

                        dueTime: eventResult.field_hatarido,
                        startDate: eventResult.field_kezdesi_datum,
                        startTime: eventResult.field_kezdesi_ido,
                        length: parseInt(eventResult.field_idotartam),

                        users: eventResult.field_resztvevok.split(', ').map(idString => parseInt(idString)),
                        location: parseInt(eventResult.field_sav),
                    };
                    return rule;
                });
            });
    }

}

export default new DrupalConnection();