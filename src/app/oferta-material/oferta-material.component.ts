import { Component, OnInit } from '@angular/core';
import {requestCameraPermissions, takePicture} from "@nativescript/camera";
import * as bgHttp from "@nativescript/background-http"
import {Image} from "@nativescript/core/ui/image";
import {OfertaModel} from "../../models/oferta.model";
import { Accuracy } from "@nativescript/core/ui/enums";
import {url_api} from "../../env/url-default"
import {getString} from "@nativescript/core/application-settings";
import {isAndroid} from "@nativescript/core/platform";
import {fromAsset} from "@nativescript/core/image-source";
import {RouterExtensions} from "@nativescript/angular";
import {Page} from "@nativescript/core/ui/page";
import {OfertaService} from "../../services/oferta.service";
import * as geolocation from "nativescript-geolocation";

@Component({
  selector: 'ns-oferta-material',
  templateUrl: './oferta-material.component.html',
  styleUrls: ['./oferta-material.component.css']
})
export class OfertaMaterialComponent implements OnInit {

    public processing:boolean = false
    lr: OfertaModel
    public image
    public photoPath: string = ""

  constructor(private lrs: OfertaService, private page: Page, private rt: RouterExtensions) {
        this.lr = new OfertaModel()
  }


  ngOnInit(): void {
      requestCameraPermissions()
      this.image = new Image()
  }
    checkCa(){

        let cont = true
        if(this.lr.descricao == undefined)
            cont = false
        if(this.lr.localizacao_lat == undefined)
            cont = false
        if(this.photoPath == "")
            cont = false
        console.log(cont)
        if(cont)
            this.store()

    }
    store(){
        this.processing = true
        this.lrs.store(this.lr).subscribe(response => {
            this.upload(response['data']['id']);
        }, error => {
            this.processing = false
        })
    }
    capturePhoto() {
        let options = {
            width: 250,
            height: 300,
            keepAspectRatio: true,
            saveToGallery: false
        }

        takePicture(options)
            .then(image => {
                this.image.imageSource = image
                if(isAndroid)
                    this.photoPath = image['_android']
                fromAsset(image)
                    .then(img => {
                        let base64 = img.toBase64String("jpeg", 100)
                        //Aqui emitir o evento para o outro component

                    })
            })

    }
    getLocation(){
        let that = this;
        geolocation.getCurrentLocation({
            desiredAccuracy: Accuracy.high,
            maximumAge: 5000,
            timeout: 10000
        }).then(function (loc) {
            if (loc) {
                that.lr.localizacao_lat = loc.latitude;
                that.lr.localizacao_long = loc.longitude;
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });

    }

    public tasks: bgHttp.Task[] = [];
    public events: { eventTitle: string, eventData: any }[] = [];
    private counter: number = 0;
    private session: any;
    public showMessage: boolean = false
    private message: string = ""
    private background: any

    upload(id: number) {
        this.start_upload(false, false, id);
    }

    start_upload(should_fail, isMulti, id) {

        const name = this.photoPath.substr(this.photoPath.lastIndexOf("/") + 1);
        const description = `${name} (${++this.counter})`;
        const request = {
            url: `${url_api}api/local-risco/uploadImage/${id}`,
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": name,
                'Accept': 'application/json',
                'Authorization': `Bearer ${getString("token")}`
            },
            description: description,
            androidAutoDeleteAfterUpload: false,
            androidNotificationTitle: 'NativeScript HTTP background',
        };

        if (should_fail) {
            request.headers["Should-Fail"] = true;
        }

        let task: bgHttp.Task;
        let lastEvent = "";

        const params = [
            { name: "status", value: "iamge"},
            { name: "fileToUpload", filename: this.photoPath, mimeType: 'image/jpeg' }
        ];
        task = this.session.multipartUpload(params, request);


        function onEvent(e) {
            if (lastEvent !== e.eventName) {
                // suppress all repeating progress events and only show the first one
                lastEvent = e.eventName;
            } else {
                return;
            }

            this.events.push({
                eventTitle: e.eventName + " " + e.object.description,
                eventData: JSON.stringify({
                    error: e.error ? e.error.toString() : e.error,
                    currentBytes: e.currentBytes,
                    totalBytes: e.totalBytes,
                    body: e.data,
                    responseCode: e.responseCode
                })
            });
        }
        function progressHandler(e) {
            // console.log("Progress " + e.currentBytes + " / " + e.totalBytes);
        }

// event arguments:
// task: Task
// responseCode: number
// error: java.lang.Exception (Android) / NSError (iOS)
// response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
        let that = this;
        function errorHandler(e) {
            // console.log("error " + e.responseCode + " code." + e.toString());
            var serverResponse = e.response;
        }


// event arguments:
// task: Task
// responseCode: number
// data: string
        function respondedHandler(e) {
            // console.log("response " + e.responseCode + " code. Server sent: " + e.data);
            that.successImage(e.data);
        }

// event arguments:
// task: Task
// responseCode: number
// response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
        function completeHandler(e) {
            // console.log("complete " + e.responseCode + " code");
            var serverResponse = e.response;
        }


        task.on("progress", progressHandler);
        task.on("error", errorHandler);
        task.on("responded", respondedHandler);
        task.on("complete", completeHandler);
        lastEvent = "";
        this.tasks.push(task);
    }

    successImage(data){
        this.processing = false;
        this.lr = new OfertaModel()
        this.session = bgHttp.session("image-upload");
        this.tasks = [];
        this.events = [];
        this.photoPath = "";
        this.showMessage = true;
        this.message = "Cadastrado com sucesso!";
        this.background = 'rgba(42,183,20,0.8)';
        setTimeout(() => {
            this.showMessage = false
        }, 3000);
    }
}
