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