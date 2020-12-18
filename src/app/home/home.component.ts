import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {registerElement} from "@nativescript/angular";
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
registerElement('MapView', () => MapView);
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "@nativescript/core/ui/enums";

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

    latitude =  -10.173044;
    longitude = -48.885372;
    zoom = 16;
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

    constructor() {
    }

    ngOnInit(): void {
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
        console.log('Map Ready');
        this.mapView = event.object;

        for (let i = 0; i < 12; i++) {
            var marker = new Marker();
            marker.position = Position.positionFromLatLng(-10.173044 + (0.001000 * i), -48.885372 + (0.000200 * i));
            marker.title = "Paraiso do Tocantins" + i;
            marker.snippet = "Brasil" + i;
            marker.userData = {index: 1};
            marker.color = '#32CD32';

            this.mapView.addMarker(marker);
        }
    }
    onMarkerEvent(args) {
        console.log("Marker Event: '" + args.eventName
            + "' triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    }

}
