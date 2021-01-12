import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {registerElement, RouterExtensions} from "@nativescript/angular";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
registerElement('MapView', () => MapView);
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "@nativescript/core/ui/enums";
import {OfertaService} from "../../services/oferta.service";
import {OfertaResponseModel} from "../../models/oferta.model";
import {timer} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

    latitude =  -10.173044;
    longitude = -48.885372;
    zoom = 14;
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    mapView: MapView;
    showInfo: boolean = false
    lastCamera: String;
    locations = [];
    watchIds = [];

    ofertas: Array<OfertaResponseModel> = []

    constructor(private ofertaService: OfertaService, private route: RouterExtensions) {
    }

    ngOnInit(): void {
        this.getOfertas()
        // timer(5000).subscribe(x => {
        //    this.getOfertas()
        // });
    }
    getOfertas(){
        this.ofertaService.show().subscribe(res =>{
            this.ofertas = res['data']
            this.setOfertasMap()
        }, error => {})
    }
    public enableLocationTap() {
        geolocation.isEnabled().then(function (isEnabled) {
            if (!isEnabled) {
                geolocation.enableLocationRequest(true, true).then(() => {
                    console.log("User Enabled Location Service");
                }, (e) => {
                    console.log("Error: " + (e.message || e));
                }).catch(ex => {
                    console.log("Unable to Enable Location", ex);
                });
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
    }

    public buttonGetLocationTap() {
        let that = this;
        geolocation.getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            maximumAge: 5000,
            timeout: 10000
        }).then(function (loc) {
            if (loc) {
                that.locations.push(loc);
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
    }
    public buttonStartTap() {
        try {
            let that = this;
            this.watchIds.push(geolocation.watchLocation(
                function (loc) {
                    if (loc) {
                        that.locations.push(loc);
                    }
                },
                function (e) {
                    console.log("Error: " + e.message);
                },
                {
                    desiredAccuracy: Accuracy.high,
                    updateDistance: 1,
                    updateTime: 3000,
                    minimumUpdateTime: 100
                }));
        } catch (ex) {
            console.log("Error: " + ex.message);
        }
    }
    public buttonStopTap() {
        let watchId = this.watchIds.pop();
        while (watchId != null) {
            geolocation.clearWatch(watchId);
            watchId = this.watchIds.pop();
        }
    }

    public buttonClearTap() {
        this.locations.splice(0, this.locations.length);
    }
    // Map events
    onMapReady(event) {
        this.mapView = event.object;
        this.setOfertasMap()
    }
    setOfertasMap(){
        for (let i = 0;i < this.ofertas.length; i++){
            var marker = new Marker();
            marker.position = Position.positionFromLatLng(this.ofertas[i].localizacao_id.latitude, this.ofertas[i].localizacao_id.longitude);
            marker.title = this.ofertas[i].nome;
            marker.snippet = this.ofertas[i].descricao;
            marker.userData = {index: this.ofertas[i].id};
            marker.color = '#32CD32';

            this.mapView.addMarker(marker);
        }
    }
    onMarkerEvent(args) {
        this.route.navigate(['home-detail'],{
            clearHistory: false,
            animated: true,
            transition: {
                name: 'slideBottom',
                duration: 500,
                curve: 'ease'
            },
            queryParams: {
                id: args.marker.userData.index
            }
            ,
        })
    }
}
