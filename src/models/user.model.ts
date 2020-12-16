export class UserModel {
    nome: string
    email: string
    telefone: string
    password: string
    password_confirmation: string
}

export class UserValidator{
    nome: Array<string>
    email: Array<string>
    telefone: Array<string>
    password: Array<string>
    password_confirmation: Array<string>
}
