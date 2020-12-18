export class OfertaModel {
    nome: string
    descricao: string
    qntd: string
    unidade_medida: string
    localizacao_lat: number
    localizacao_long: number
    foto: any
    tipo_negociacao: string
    data_expiracao: Date
    id: number
    classificacao: string

}

export class OfertaValidator{
    nome: Array<string>
    descr: Array<string>
    telefone: Array<string>
    password: Array<string>
    password_confirmation: Array<string>
}
