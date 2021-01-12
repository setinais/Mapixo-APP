import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { Page} from "@nativescript/core/ui/page";
import {RouterExtensions} from "@nativescript/angular";
import {ActivatedRoute} from "@angular/router";
import {OfertaResponseModel} from "../../models/oferta.model";
import {OfertaService} from "../../services/oferta.service";
@Component({
    templateUrl: './my-ofertas.component.html',
    styleUrls: ['./my-ofertas.component.css'],
})
export class MyOfertasComponent implements OnInit {

    dados: Array<OfertaResponseModel>
    showMessage: boolean = false
    background: any
    message: string = "";
    selectedTabview = 0;

    concluidos: Array<OfertaResponseModel>
    constructor(private page: Page,
                private _router: RouterExtensions,
                private route: ActivatedRoute,
                private ofertaService: OfertaService
    ) {
    }

    ngOnInit() {
        this.ofertaService.getOfertasUser().subscribe(response => {this.dados = response['data']['pendetes']; this.concluidos = response['data']['concluidas']}, error => {alert('Servidor fora do ar!'); this._router.back()})
    }

    delete(id: OfertaResponseModel){
        this.ofertaService.delete(id.id).subscribe(res =>
        {
            this.ngOnInit()
        }, error => {
            alert('Falha de conexão')
            console.log(error.errors)
        })
    }
    sucess(id: OfertaResponseModel){
        this.ofertaService.sucess(id.id).subscribe(res => {
            this.ngOnInit()
        }, error => {
            alert('Falha de conexão')
            console.log(error.errors)
        })
    }
    onPendentes(){ this.selectedTabview=0 }
    onConcluidas(){ this.selectedTabview =1}
    onEdit(dado: OfertaResponseModel){
        this._router.navigate(["my-ofertas-edit/" + dado.id, {
            animated: true,
            transition: {
                name: "slideTop",
                duration: 380,
                curve: "easeIn"
            }
        }]);
    }
}
