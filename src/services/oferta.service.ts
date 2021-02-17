import { Injectable } from '@angular/core';
import {CredentialsModel} from "../models/credentials.model";
import {HttpClient} from "@angular/common/http";
import {url_api} from "../env/url-default";
import {OfertaModel, OfertaResponseModel, SolicitacaoColeta} from "../models/oferta.model";

@Injectable({
    providedIn: 'root'
})
export class OfertaService {

    constructor(private http:HttpClient) {  }

    store(user: OfertaModel){
        return this.http.post(`${url_api}oferta`, user)
    }
    show(){
        return this.http.get(`${url_api}oferta`)
    }
    index(id: number){
        return this.http.get(`${url_api}oferta/${id}`)
    }
    put(user:OfertaResponseModel, id: number){
        return this.http.put(`${url_api}oferta/${id}`, user);
    }
    delete(id: number){
        return this.http.delete(`${url_api}oferta/${id}`)
    }

    getClassificao(){
        return this.http.get(`${url_api}classificacao`)
    }
    getUnidademedida(){
        return this.http.get(`${url_api}unidade_medida`)
    }
    getOfertasUser(){
        return this.http.get(`${url_api}getOfertasUser`)
    }
    sucess(id: number){
        return this.http.get(`${url_api}sucessOferta/${id}`)
    }
    storeSolicitacaoColeta(sc: SolicitacaoColeta){
        return this.http.post(`${url_api}coleta_oferta`, sc)
    }
}
