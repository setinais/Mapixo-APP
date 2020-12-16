import { Injectable } from '@angular/core';
import {CredentialsModel} from "~/models/credentials.model";
import {HttpClient} from "@angular/common/http";
import {url_api} from "~/env/url-default";
import {OfertaModel} from "~/models/oferta.model";

@Injectable({
    providedIn: 'root'
})
export class OfertaService {

    constructor(private http:HttpClient) {  }

    store(user: OfertaModel){
        return this.http.post(`${url_api}user/store`, user)
    }
    show(){
        return this.http.get(`${url_api}user/show`)
    }
    put(user:OfertaModel, id){
        return this.http.put(`${url_api}user/update`, user);
    }
    delete(id: number){
        return this.http.delete(`${url_api}user/delete`)
    }
}
