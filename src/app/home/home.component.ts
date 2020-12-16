import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {registerElement} from "nativescript-angular/element-registry";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
registerElement('MapView', () => MapView);

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    // @ViewChild("MapView", {static: false}) mapView: ElementRef;

    latitude =  -10.173044;
    longitude = -48.885372;
    zoom = 16;
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    mapView: MapView;
    local: string
    showInfo: boolean = false

    lastCamera: String;
    dados_info: Array<boolean> = []
    constructor() { }

    ngOnInit(): void { }
    onMapReady(event) {
        console.log('Map Ready');

        this.mapView = event.object;

        for (let i = 0; i<12;i++){
        var marker = new Marker();
        marker.position = Position.positionFromLatLng(-10.173044 +(0.001000 * i), -48.885372 + (0.000200 * i));
        marker.title = "Paraiso do Tocantins"+i;
        marker.snippet = "Brasil"+i;
        marker.userData = {index: 1};
        marker.color = '#32CD32';

        this.mapView.addMarker(marker);

        }
    }

    onMarkerEvent(args) {
        console.log("Marker Event: triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
        this.showInfo = true
    }
    setDadosInfo(id: number){

    }
}
