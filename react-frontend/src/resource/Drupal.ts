import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {
    CreationResponse,
    DrupalCreationResponse,
    DrupalEventRequest,
    DrupalLocation,
    DrupalLogin,
    DrupalLoginResult,
    DrupalRule,
    DrupalScheduleEvent,
    DrupalUser,
    DrupalUserResult,
    EventLocation,
    EventRequest,
    EventRequestCreationForm,
    LocationCreationForm,
    RequestStatus,
    Rule,
    RuleCreationForm,
    ScheduleEvent,
    ScheduleEventCreationForm,
    transformCreationResponse,
    UserRole
} from "./Types";
import moment from "moment";

export const SERVER_ADDR = "https://versenydonto.nisz.hu:10016";

class DrupalConnection {
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
                        uuid: userResult.uuid,
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
                        id: parseInt(locationResult.nid),
                        uuid: locationResult.uuid,
                        name: locationResult.title
                    };
                    return location;
                });
            });
    }

    async createLocation(data: LocationCreationForm): Promise<CreationResponse> {
        const body: any = {
            "_links": {
                "type": {
                    "href": SERVER_ADDR + "/rest/type/node/sav"
                }
            },
            title: [
                {
                    value: data.name
                }
            ],
        };

        return this.axios.post<DrupalCreationResponse>("/node?_format=hal_json", body,
            {
                headers: {
                    "Content-Type": "application/hal+json"
                }
            })
            .then(result => transformCreationResponse(result.data));
    }

    async getRules(): Promise<Rule[]> {
        return this.axios.get<DrupalRule[]>("/api/rule?_format=hal_json")
            .then(result => {
                return result.data.map(ruleResult => {

                    const rule: Rule = {
                        name: ruleResult.title,
                        id: parseInt(ruleResult.nid),
                        repeatRule: ruleResult.field_t_ismetlesi_szabaly,
                        startDateTime: moment.unix(parseInt(ruleResult.field_t_kezdesi_ido)),
                        length: moment(ruleResult.field_idotartam, ['hh:mm:ss']),
                        users: ruleResult.field_resztvevok.split(', ').map(idString => parseInt(idString))
                    };
                    return rule;
                });
            });
    }

    async createRule(data: RuleCreationForm): Promise<CreationResponse> {
        const body: any = {
            "_links": {
                "type": {
                    "href": SERVER_ADDR + "/rest/type/node/tiltas"
                }
            },
            title: [
                {
                    value: data.name
                }
            ],
            field_t_ismetlesi_szabaly: [
                {
                    value: data.repeatRule
                }
            ],
            field_t_kezdesi_ido: [
                {
                    value: data.startDateTime.unix()
                }
            ],
            field_idotartam: [
                {
                    value: data.length.format(moment.HTML5_FMT.TIME_SECONDS)
                }
            ],
            field_resztvevok: [
                {
                    value: data.userUUIDs.join(", ")
                }
            ],
            "_embedded": {

            }
        };
        body._embedded[SERVER_ADDR + "/rest/relation/node/tiltas/field_resztvevok"] = [];
        data.userUUIDs.forEach(uuid => {
            body._embedded[SERVER_ADDR + "/rest/relation/node/tiltas/field_resztvevok"].push({
                uuid: [
                    {
                        value: uuid
                    }
                ]
            })
        });

        return this.axios.post<DrupalCreationResponse>("/node?_format=hal_json", body,
            {
                headers: {
                    "Content-Type": "application/hal+json"
                }
            })
            .then(result => transformCreationResponse(result.data));
    }

    async getEventRequests(): Promise<EventRequest[]> {
        return this.axios.get<DrupalEventRequest[]>("/api/request?_format=hal_json")
            .then(result => {
                return result.data.map(requestResult => {
                    const description: any = JSON.parse(requestResult.field_leiras.replace(/(&quot\;)/g,"\""));
                    let status: RequestStatus = RequestStatus.AwaitingConfirmation;
                    switch (requestResult.field_allapot) {
                        case 0:
                            status = RequestStatus.Rejected;
                            break;
                        case 1:
                            status = RequestStatus.AwaitingConfirmation;
                            break;
                        case 2:
                            status = RequestStatus.Accepted;
                            break;
                    }

                    const request: EventRequest = {
                        id: parseInt(requestResult.nid),
                        status: status,
                        type: requestResult.title,
                        description: description.description,
                        length: moment(description.length, ['hh:mm:ss']),
                        creationDate: moment(requestResult.changed)
                    };
                    return request;
                });
            });
    }

    async createEventRequest(data: EventRequestCreationForm): Promise<CreationResponse> {
        const body: any = {
            "_links": {
                "type": {
                    "href": SERVER_ADDR + "/rest/type/node/kerelem"
                }
            },
            title: [
                {
                    value: data.type
                }
            ],
            field_leiras: [
                {
                    value: JSON.stringify({
                        description: data.description,
                        length: data.length.format(moment.HTML5_FMT.TIME_SECONDS),
                    })
                }
            ],
            field_letrehozasi_datum: [
                {
                    value: moment().unix()
                }
            ],
            field_allapot: [
                {
                    value: RequestStatus.AwaitingConfirmation
                }
            ]
        };

        return this.axios.post<DrupalCreationResponse>("/node?_format=hal_json", body,
            {
                headers: {
                    "Content-Type": "application/hal+json"
                }
            })
            .then(result => transformCreationResponse(result.data));
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

                        dueTime: moment(eventResult.field_hatarido),
                        startTimeDate: moment.unix(parseInt(eventResult.field_kezdesi_ido)),
                        length: moment(eventResult.field_idotartam, ['hh:mm:ss']),

                        users: eventResult.field_resztvevok.split(', ').map(idString => parseInt(idString)),
                        location: parseInt(eventResult.field_sav),
                    };
                    return rule;
                });
            });
    }

    async createScheduleEvent(data: ScheduleEventCreationForm): Promise<CreationResponse> {
        const body: any = {
            "_links": {
                "type": {
                    "href": SERVER_ADDR + "/rest/type/node/napirend"
                }
            },
            title: [
                {
                    value: data.name
                }
            ],
            field_megjegyzes: [
                {
                    value: data.content
                }
            ],
            field_ismetlesi_szabaly: [
                {
                    value: data.repeatRule
                }
            ],
            field_kezdesi_ido: [
                {
                    value: data.startDateTime.unix()
                }
            ],
            field_idotartam: [
                {
                    value: data.length.format(moment.HTML5_FMT.TIME_SECONDS)
                }
            ],
            "_embedded": {

            }
        };

        body._embedded[SERVER_ADDR + "/rest/relation/node/napirend/field_resztvevok"] = [];
        data.userUUIDs.forEach(uuid => {
            body._embedded[SERVER_ADDR + "/rest/relation/node/napirend/field_resztvevok"].push({
                uuid: [
                    {
                        value: uuid
                    }
                ]
            })
        });
        body._embedded[SERVER_ADDR + "/rest/relation/node/napirend/field_sav"] = [
            {
                uuid: [
                    {
                        value: data.locationUUID
                    }
                ]
            }
        ];

        return this.axios.post<DrupalCreationResponse>("/node?_format=hal_json", body,
            {
                headers: {
                    "Content-Type": "application/hal+json"
                }
            })
            .then(result => transformCreationResponse(result.data));
    }

}

export default new DrupalConnection();