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
    username: string,
    roles: string[]
}

export interface DrupalUser {
    id: number,
    username: string,
    role: UserRole
}

export interface DrupalLocation {
    field_sav_tipus: string
}

export interface EventLocation {
    locationName: string
}

export interface DrupalRule {
    field_idotartam: string
    field_t_ismetlesi_szabaly: string
    field_t_kezdesi_ido: string
    field_resztvevok: string
}

export interface Rule {
    repeatRule: string,
    startTime: string,
    length: number,
    users: number[]
}

export enum RequestStatus {
    Rejected,
    AwaitingConfirmation,
    Accepted
}

export interface DrupalEventRequest {
    field_allapot: RequestStatus,
    field_kerelem_tipusa: string,
    field_leiras: string,
    field_letrehozasi_datum: string,
}

export interface EventRequest {
    status: RequestStatus,
    type: string,
    description: string,
    creationDate: string
}

export interface DrupalUsageEvent {
    field_ismetlesi_szabaly: string,
    field_megjegyzes: string,

    field_hatarido: string,
    field_kezdesi_datum: string,
    field_kezdesi_ido: string,
    field_idotartam: string,

    field_resztvevok: string,
    field_sav: string,
}

export interface UsageEvent {
    repeatRule: string,
    comment: string,

    dueTime: string,
    startDate: string,
    startTime: string,
    length: number,

    users: number[],
    location: number,
}