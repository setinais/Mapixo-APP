import {Component, OnInit} from '@angular/core';
import {UserModel, UserValidator} from "~/models/user.model";
import {EventData, Page} from "tns-core-modules/ui/page";
import {UserService} from "~/services/user.service";
import {RouterExtensions} from "nativescript-angular";
import {Switch} from "tns-core-modules/ui/switch";
import {AuthService} from "~/services/auth.service";

@Component({
    selector: 'ns-putuser',
    templateUrl: './putuser.component.html',
    styleUrls: ['./putuser.component.css']
})
export class PutuserComponent implements OnInit {


    userOld: any
    user: UserModel
    formUserValidator: UserValidator
    processing: boolean
    alterStatus: boolean = false
    Editar: string = 'Editar'
    checkedSwitch: boolean
    reload: boolean
    constructor(private page: Page,
                private userService: UserService,
                private routeExtension: RouterExtensions,
                private authService: AuthService) {
        this.user = new UserModel()
        this.processing = true
        this.reload = false
        this.checkedSwitch = false
        this.page.actionBarHidden = !this.page.actionBarHidden
    }

    ngOnInit() {
        this.start()
    }
    start(){
        this.reload = true
        this.userService.show().subscribe(response => {
            this.userOld = response['data']
            this.prepareForm(response['data'])
            this.processing = false
        }, error => {
            this.processing = false
            this.alterStatus = false
            this.reload = false
        })
    }
    edit() {
        this.alterStatus = true
    }

    cancelEdit(){
        this.alterStatus = false
    }

    checkAlter() {
        this.alterStatus = false
        if (this.user.email == this.userOld['email'])
            this.user.email = undefined
        if (this.user.telefone == this.userOld['telefone'])
            this.user.telefone = undefined
        if (this.user.nome == this.userOld['nome'])
            this.user.nome = undefined
        this.submit()
    }

    submit() {
        console.log(this.user)
        this.userService.put(this.user, this.userOld['id']).subscribe(response => {
            this.Editar = "Editar"
            this.userOld = response['data']
            this.prepareForm(response['data'])
            this.processing = false
            this.formUserValidator = undefined
        }, error => {
            if (error.status == 422) {
                this.formUserValidator = error.error['errors']
            } else {
                alert(error.error['message'])
                console.log(error.error)
            }
            this.prepareForm(this.userOld)
            this.processing = false
            this.alterStatus = true
        })
    }

    prepareForm(response) {

        this.user.email = response['email']
        this.user.telefone = response['telefone']
        this.user.nome = response['name']
    }
    logout(){
        this.authService.logout()
        this.routeExtension.navigate(['login'],{
            clearHistory: true,
            animated: true,
            transition: {
                name: 'slideBottom',
                duration: 500,
                curve: 'ease'
            }
        })
    }

    delete(){
        this.userService.delete(this.userOld['id']).subscribe(response => {
            alert('Conta apagada com sucesso!')
            this.authService.logout()
            this.routeExtension.navigate(['login'],{
                clearHistory: true,
                animated: true,
                transition: {
                    name: 'slideBottom',
                    duration: 500,
                    curve: 'ease'
                }
            })
        }, error => {
            alert("Falha de comunicação com servidor!")
        })
    }
}

