import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {registerElement} from "@nativescript/angular";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
registerElement('MapView', () => MapView);
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "@nativescript/core/ui/enums";
import {OfertaService} from "../../services/oferta.service";
import {OfertaResponseModel} from "../../models/oferta.model";
import * as utils from "@nativescript/core/utils/utils";
import * as TNSPhone from "nativescript-phone";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ns-home',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.css']
})

export class HomeDetailComponent implements OnInit{

    private imagens: any[] = []

    public showMessage: boolean = false
    private background: any
    private message: string = "";

    ofertaDetail: OfertaResponseModel
    constructor(private route: ActivatedRoute, private ofertaService: OfertaService) {}


    ngOnInit() {
        this.ofertaService.index(this.route.queryParams['_value'].id).subscribe(response => {
            this.ofertaDetail = response['data']
            this.imagens.push(response['data']['foto'])
        }, error => {alert('Servidor fora do ar!'); })

    }
    onNavigate(){
        utils.openUrl(`http://maps.google.com/maps?q=${this.ofertaDetail.localizacao_id.latitude},${this.ofertaDetail.localizacao_id.longitude}`)
    }

    onPhone(telefone){
        TNSPhone.requestCallPermission('Você deve aceitar a permissão para fazer chamada!.')
            .then(() => TNSPhone.dial(telefone, false))
            .catch(() => TNSPhone.dial(telefone, true));
    }
}
