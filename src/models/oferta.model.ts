export class OfertaModel {
    nome: string
    descricao: string
    qntd: string
    unidade_medida: string
    localizacao_lat: number
    localizacao_long: number
    foto: string
    tipo_negociacao: string
    id: number
    classificacao: string
    valor: string

}

export class OfertaValidator{
    nome: Array<string>
    descr: Array<string>
    telefone: Array<string>
    password: Array<string>
    password_confirmation: Array<string>
}

export class Classificacao{
    id: number
    nome: string
}

export class UnidadeMedida{
    id: number
    nome: string
}

export class OfertaResponseModel{
    id: number
    classificacao_id: string
    user_id: {
        id: number
        name: string
        email: string
        telefone: string
    }
    unidade_medida_id: string
    localizacao_id: {
        id: number
        latitude: number
        longitude: number
    }
    nome: string
    descricao: string
    qntd: number
    foto: string
    status: number
    valor: number
    tipo_negociacao: string
    created_at: string
    updated_at: string
}
