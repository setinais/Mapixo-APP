import {Component, OnInit, ViewChild} from '@angular/core';
import {Page} from "@nativescript/core/ui/page";
import {RouterExtensions} from "@nativescript/angular";
import {FloatLabel} from "../../styles/float-label";
import {UserModel} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
    selector: 'ns-redefinir-senha',
    templateUrl: './redefinir-senha.component.html',
    styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {

    user: UserModel
    processing: boolean
    textError: string
    @ViewChild('password', {static: false}) password: FloatLabel
    @ViewChild('confirm', {static: false}) confirm: FloatLabel

    constructor(private page: Page, private router: RouterExtensions, private userService: UserService) {
        this.page.actionBarHidden = !this.page.actionBarHidden
        this.user = new UserModel()
        this.processing = false
    }

    ngOnInit() {
    }

    back() {
        this.router.back()
    }

    onButtonTap() {
        if(this.password.value.length < 6 || this.password.value == ""){
            this.confirm.onError()
            this.password.hasError = true
            this.textError = "A senha deve conter no mínimo 6 caracteries"
            return
        }
        if (this.password.value == this.confirm.value) {
            this.password.onDisabled()
            this.confirm.onDisabled()
            this.processing = true
            this.password.hasError = false
            this.confirm.hasError = false
            this.user.password = this.password.value
            this.userService.put(this.user, 0).subscribe(response => {
                alert("Senha atualizada!")
                this.processing = false
                this.password.onDisabled()
                this.confirm.onDisabled()
                this.router.back()
            }, error => {
                alert("Falha de conexão")
                this.processing = false
                this.password.onDisabled()
                this.confirm.onDisabled()
            })

        } else {
            this.confirm.onError()
            this.password.hasError = true
            this.textError = "As senhas não são iguais"
        }
    }
}
