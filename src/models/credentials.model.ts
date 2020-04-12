export class CredentialsModel {
    constructor(token_name: string) {
        this.token_name = token_name;
    }
    email: string
    password: string
    token_name: string
}

export class ValidatorCredentials{
    email: Array<string>
    password: Array<string>
    token_name: Array<string>
}
