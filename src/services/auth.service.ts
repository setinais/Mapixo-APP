import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CredentialsModel} from "../models/credentials.model";
import {url_api} from "../env/url-default";
import {TokenModel} from "../models/token.model";
import {tap} from "rxjs/internal/operators";
import {getString, setBoolean, setString} from "@nativescript/core/application-settings";

@Injectable({
    providedIn: "root"
})
export class AuthService {

    token: TokenModel

    constructor(private http:HttpClient) {}

    login(auth: CredentialsModel){
        return this.http.post(`${url_api}airlock/token`, auth)
            .pipe(tap(response => {
                this.setToken(response as TokenModel)
            }))
    }

    setToken(theToken: TokenModel){
        let today = new Date()
        today.setSeconds(new Date().getSeconds() + 10368000)

        setString("token",theToken.token)
        setString("expires_in", today.toString())
        setBoolean("status_auth", true)

    }

    isLoggedIn(){
        let date = new Date(getString("expires_in"))
        let date_atual = new Date()
        if(date.getTime() <= date_atual.getTime())
            setString("token", "");
        return !!getString("token")
    }

    logout(){
        setString("token","")
        setString("expires_in", "")
        setString("user_id", "")
        setBoolean("status_auth", false)
    }
}
