import { Injectable } from '@angular/core';
import {CredentialsModel} from "../models/credentials.model";
import {HttpClient} from "@angular/common/http";
import {url_api} from "../env/url-default";
import {UserModel} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) {  }

    store(user: UserModel){
      return this.http.post(`${url_api}user/store`, user)
    }
    show(){
        return this.http.get(`${url_api}user/show`)
    }
    put(user:UserModel, id){
        return this.http.put(`${url_api}user/update`, user);
    }
    delete(id: number){
        return this.http.delete(`${url_api}user/delete`)
    }
}
