import { Component, ElementRef, ViewChild } from "@angular/core";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import * as utils from "tns-core-modules/utils/utils";
import {CredentialsModel, ValidatorCredentials} from "~/models/credentials.model";
import {url_api} from "~/env/url-default";
import {AuthService} from "~/services/auth.service";
import {ResponseModel} from "~/models/response.model";

@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoggingIn = true;
    user: CredentialsModel;
    processing = false;
    @ViewChild("password", {static: false}) password: ElementRef;
    @ViewChild("confirmPassword", {static: false}) confirmPassword: ElementRef;

    form_validator: ValidatorCredentials

    constructor(private page: Page, private userService: AuthService, private routerExtensions: RouterExtensions) {
        this.page.actionBarHidden = true;
        this.user = new CredentialsModel("mapixo_app");
        this.form_validator = new ValidatorCredentials();
    }

    submit() {
        if (!this.user.email || !this.user.password) {
            this.form_validator.email = ["Por favor preencha todos os campos."];
            return;
        }

        this.processing = true;
        if (this.isLoggingIn) {
            this.login();
        }
    }

    login() {
        console.log(this.user)
        this.userService.login(this.user)
            .subscribe(response => {
                this.processing = false;
                this.routerExtensions.navigate(["/home"], { clearHistory: true });
            }, error => {
                this.processing = false;
                if(error.status == 422){
                    this.form_validator = error.error.errors
                }else if(error.status == 500){
                    this.alert("Falha interna do servidor! Contate um Administrado")
                }else{
                    this.alert("Falha na conexão com a internet!")
                }
            });
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPassword.nativeElement.focus();
        }
    }

    alert(message: string) {
        return alert({
            title: "Atenção",
            okButtonText: "OK",
            message: message
        });
    }

    forgotPassword(){
        utils.openUrl(url_api+'password/reset')
    }
}

