import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {requestCameraPermissions, takePicture} from "@nativescript/camera";
import * as bgHttp from "@nativescript/background-http"
import {Image} from "@nativescript/core/ui/image";
import {Classificacao, OfertaModel, OfertaResponseModel, UnidadeMedida} from "../../models/oferta.model";
import { Accuracy } from "@nativescript/core/ui/enums";
import {url_api} from "../../env/url-default"
import {getString} from "@nativescript/core/application-settings";
import {isAndroid} from "@nativescript/core/platform";
import {ImageSource} from "@nativescript/core/image-source";
import {PageRoute, RouterExtensions} from "@nativescript/angular";
import {Page} from "@nativescript/core/ui/page";
import {OfertaService} from "../../services/oferta.service";
import * as geolocation from "nativescript-geolocation";
import { EventData, fromObject } from "@nativescript/core/data/observable";
import { ListPicker } from '@nativescript/core/ui/list-picker';
import {switchMap} from "rxjs/operators";
@Component({
    templateUrl: './my-ofertas-edit.component.html',
    styleUrls: ['./my-ofertas-edit.component.css'],
})
export class MyOfertasEditComponent implements OnInit {

    public processing:boolean = false
    lr: OfertaResponseModel
    public image
    public photoPath: string = ""
    public endereco
    itemId: any
    update_foto: boolean = false

    public tipo_nego: Array<string> = ['Venda', 'Doação', 'Reciclagem']
    public unidade_med: Array<string> = []
    public classificacao: Array<string> = []

    selectedIndexMedida: number = 0;
    selectedIndexClassi: number = 0;
    selectedIndexTipo: number = 0;

    public tasks: bgHttp.Task[] = [];
    public events: { eventTitle: string, eventData: any }[] = [];
    private counter: number = 0;
    public session:any = bgHttp.session("image-upload")
    public showMessage: boolean = false
    private message: string = ""
    private background: any

    @ViewChild("unidade_medida_picker", {static: false}) unidade_medida_picker: ListPicker;
    @ViewChild("classificacao_picker", {static: false}) classificacao_picker: ListPicker;
    @ViewChild("tipo_picker", {static: false}) tipo_picker: ListPicker;

    constructor(private lrs: OfertaService, private page: Page, private rt: RouterExtensions, private pageRoute: PageRoute) {
        this.lr = new OfertaResponseModel()
        this.lr.foto = ""

    }

    ngOnInit(): void {
        this.pageRoute.activatedRoute.pipe(
            switchMap(activatedRoute => activatedRoute.params)
        ).forEach((params) => {
            this.lrs.index(+params["id"]).subscribe(response => {
                this.lr = response['data']
                this.lrs.getClassificao().subscribe(res => {
                    this.classificacao = res['data']
                    this.classificacao_picker.selectedIndex = this.classificacao.indexOf(this.lr.classificacao_id)
                    this.selectedIndexClassi = this.classificacao.indexOf(this.lr.classificacao_id)
                    this.tipo_picker.selectedIndex = this.tipo_nego.indexOf(this.lr.tipo_negociacao)
                    this.selectedIndexTipo = this.tipo_nego.indexOf(this.lr.tipo_negociacao)
                }, error => {})
                this.lrs.getUnidademedida().subscribe(res => {
                    this.unidade_med = res['data']
                    this.unidade_medida_picker.selectedIndex = this.unidade_med.indexOf(this.lr.unidade_medida_id)
                    this.selectedIndexMedida = this.unidade_med.indexOf(this.lr.unidade_medida_id)
                }, error => {})
            }, error => {alert('Servidor fora do ar!'); })
        })
        this.image = new Image()
    }
    public onSelectedIndexChangedUnidade(args: EventData) {
        const picker = <ListPicker>args.object;
        this.lr.unidade_medida_id = this.unidade_med[picker.selectedIndex]
    }
    public onSelectedIndexChanged(args: EventData) {
        const picker = <ListPicker>args.object;
        this.lr.tipo_negociacao = this.tipo_nego[picker.selectedIndex]
        console.log(this.lr)
    }
    public onSelectedIndexChangedClassificacao(args: EventData) {
        const picker = <ListPicker>args.object;
        this.lr.classificacao_id = this.classificacao[picker.selectedIndex]
    }
    onNavigateToUnidade(fargs){
        const listPickerComponent = fargs.object;
        listPickerComponent.on("selectedIndexChange", (args: EventData) => {
            const picker = <ListPicker>args.object;
            picker.selectedIndex = this.unidade_med.indexOf(this.lr.unidade_medida_id)
        });
    }
    checkCa(){

        let cont = true
        if(this.lr.descricao == undefined)
            cont = false
        if(this.lr.qntd == undefined)
            cont = false
        if(this.lr.nome == undefined)
            cont = false
        if(this.lr.foto == "")
            cont = false
        if(cont)
            this.update()

    }
    update(){
        this.upload(this.lr.id)
        this.lrs.put(this.lr, this.lr.id).subscribe(res=>{
            this.rt.navigate(["my-ofertas"] , {
                animated: true,
                transition: {
                    name: "slideTop",
                    duration: 380,
                    curve: "easeIn"
                }
            });
        }, error => {

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
                    this.lr.foto = image['_android']
                this.photoPath = image['_android']
                this.update_foto = true
                ImageSource.fromAsset(image)
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
                that.lr.localizacao_id.latitude = loc.latitude;
                that.lr.localizacao_id.longitude = loc.longitude;
                // fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + loc.latitude + "," + loc.longitude + "&key=AIzaSyBOMiyrIQJ1opY_cyC97qrvTvU9kceukhw")
                //     .then((response) => response.json()).then((r) => {
                //     console.log(r);
                //     if (r.results[0]) {
                //         this.endereco = r.results[0].formatted_address;
                //     }
                // });
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });

    }



    upload(id: number) {
        if(this.update_foto)
            this.start_upload(false, false, id);
    }

    start_upload(should_fail, isMulti, id) {

        const name = this.photoPath.substr(this.photoPath.lastIndexOf("/") + 1);
        const description = `${name} (${++this.counter})`;
        const request = {
            url: `${url_api}oferta/uploadImage/${id}`,
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
            { name: "file", filename: this.photoPath, mimeType: 'image/jpeg' }
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
            console.log("Progress " + e.currentBytes + " / " + e.totalBytes);
        }

// event arguments:
// task: Task
// responseCode: number
// error: java.lang.Exception (Android) / NSError (iOS)
// response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
        let that = this;
        function errorHandler(e) {
            console.log("error " + e.responseCode + " code." + e.toString());
            console.log(e.response.toString())
            var serverResponse = e.response;
        }


// event arguments:
// task: Task
// responseCode: number
// data: string
        function respondedHandler(e) {
            console.log("response " + e.responseCode + " code. Server sent: " + e.data);
            that.successImage(e.data);
        }

// event arguments:
// task: Task
// responseCode: number
// response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
        function completeHandler(e) {
            console.log("complete " + e.responseCode + " code");
            var serverResponse = e.response;
        }
        console.log('rgeg')

        task.on("progress", progressHandler);
        task.on("error", errorHandler);
        task.on("responded", respondedHandler);
        task.on("complete", completeHandler);
        lastEvent = "";
        this.tasks.push(task);
    }

    successImage(data){
        this.processing = false;
        this.lr = new OfertaResponseModel()
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
