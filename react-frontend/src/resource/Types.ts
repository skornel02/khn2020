import moment from "moment";

export interface DrupalLoginResult {
    current_user: {
        uid: number,
        roles: string[] | undefined,
        name: string
    }
    csrf_token: string,
    logout_token: string,
}

export interface DrupalLogin {
    id: number,
    username: string,
    roles: string[],
    csrfToken: string,
    logoutToken: string
}

export enum UserRole {
    Anon,
    Parent,
    Kid,
    Grandma
}

export interface DrupalUserResult {
    uid: number,
    uuid: string,
    username: string,
    roles: string[]
}

export interface DrupalUser {
    id: number,
    uuid: string,
    username: string,
    role: UserRole
}

export interface DrupalLocation {
    nid: string,
    uuid: string,
    title: string,
}

export interface EventLocation {
    id: number,
    uuid: string,
    name: string
}

export interface LocationCreationForm {
    name: string,
}

export interface DrupalRule {
    title: string,
    nid: string,
    field_idotartam: string
    field_t_ismetlesi_szabaly: string
    field_t_kezdesi_ido: string
    field_resztvevok: string
}

export interface Rule {
    name: string,
    id: number,
    repeatRule: string,
    startDateTime: moment.Moment,
    length: moment.Moment,
    users: number[]
}

export interface RuleCreationForm {
    name: string,
    repeatRule: string | undefined,
    startDateTime: moment.Moment,
    length: moment.Moment,
    userUUIDs: string[]
}

export enum RequestStatus {
    Rejected,
    AwaitingConfirmation,
    Accepted
}

export interface DrupalEventRequest {
    nid: string,
    title: string,
    field_leiras: string,
    changed: string,
    field_allapot: RequestStatus,
}

export interface EventRequest {
    id: number
    status: RequestStatus,
    type: string,
    description: string,
    length: moment.Moment,
    creationDate: moment.Moment
}

export interface EventRequestCreationForm {
    type: string,
    description: string,
    length: moment.Moment,
}

export interface DrupalScheduleEvent {
    nid: string
    title: string,
    field_megjegyzes: string,
    field_ismetlesi_szabaly: string,

    field_hatarido: string,
    field_kezdesi_ido: string,
    field_idotartam: string,

    field_resztvevok: string,
    field_sav: string,
}

export interface ScheduleEvent {
    id: number,
    type: string,
    repeatRule: string,
    comment: string,

    dueTime: moment.Moment,
    startTimeDate: moment.Moment,
    length: moment.Moment,

    users: number[],
    location: number,
}

export interface ScheduleEventCreationForm {
    name: string,
    content: string,

    repeatRule: string | undefined,
    dueDate: string | undefined,
    startDateTime: moment.Moment,
    length: moment.Moment,

    /**
     * UUIDs
     */
    userUUIDs: string[],
    /**
     * UUID
     */
    locationUUID: string
}

export interface DrupalCreationResponse {
    "_links": {
        "self": {
            href: string
        }
    },
    uid: string,
}

export interface CreationResponse {
    id: number,
    link: string,
}

export function transformCreationResponse(response: DrupalCreationResponse): CreationResponse {
    return {
        id: parseInt(response.uid),
        link: response._links.self.href
    }
}