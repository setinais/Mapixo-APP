import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserModel, ValidatorUser} from "~/models/user.model";
import {Page} from "tns-core-modules/ui/page";
import {UserService} from "~/services/user.service";
import {RouterExtensions} from "nativescript-angular/router";
import {ResponseModel} from "~/models/response.model";

@Component({
  selector: 'ns-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

    processing = false;
    user: UserModel;
    confirm_password: string = ''
    form_validator: ValidatorUser;

    response: ResponseModel<UserModel>
    response_error: ResponseModel<ValidatorUser>


    @ViewChild("email", {static: false}) email: ElementRef;
    @ViewChild("telefone", {static: false}) telefone: ElementRef;
    @ViewChild("password", {static: false}) password: ElementRef;
    @ViewChild("confirmPassword", {static: false}) confirmPassword: ElementRef;

    constructor(private page: Page, private userService: UserService, private routerExtensions: RouterExtensions) {
        this.user = new UserModel();
        this.form_validator = new ValidatorUser();
    }

    ngOnInit(): void {

    }

    submit(){
        this.form_validator = new ValidatorUser();
        let continuar = true;
        if(!this.user.nome){
            this.form_validator.nome = ["Campo Nome Obrigatorio!"]
            continuar = false
        }
        if(!this.user.email){
            this.form_validator.email = ["Campo Email Obrigatorio!"]
            continuar = false
        }
        if(!this.user.telefone){
            this.form_validator.telefone = ["Campo Telefone Obrigatorio!"]
            continuar = false
        }
        if(!this.user.password){
            this.form_validator.password = ["Campo Senha Obrigatorio!"]
            continuar = false
        }
        if(this.user.password_confirmation != this.user.password){
            this.form_validator.password_confirmation = ["As senha não são iguais!"]
            continuar = false
        }
        if(continuar){
            this.store(this.user)
        }
    }

    store(user: UserModel){
        this.userService.store(user).subscribe(response  => {
            this.response = new ResponseModel<UserModel>(response)
            if(!this.response.errors){
                this.user = new UserModel();
                this.alert("Cadastro realizado com sucesso!")
                setTimeout(() => {
                    this.back()
                }, 2000);
            }
        }, error => {
            if(error.status == 422){
                this.response_error = error.error
                this.form_validator = this.response_error.data
            }else if(error.status == 500){
                this.alert("Falha interna do servidor! Contate um Administrado")
            }else{
                this.alert("Falha na conexão com a internet!")
            }
        })
    }

    focusEmail(){
        this.email.nativeElement.focus();
    }
    focusTelefone(){
        this.telefone.nativeElement.focus();
    }
    focusPassword(){
        this.password.nativeElement.focus();
    }
    focusConfirmPassword(){
        this.confirmPassword.nativeElement.focus();
    }

    alert(message: string) {
        return alert({
            title: "Atenção",
            okButtonText: "OK",
            message: message
        });
    }

    back(){
        this.routerExtensions.navigate(['login'],{
            clearHistory: true,
            animated: true,
            transition: {
                name: 'slideBottom',
                duration: 500,
                curve: 'ease'
            }
        })
    }
}
