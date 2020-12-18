import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import {NativeScriptFormsModule, NativeScriptModule} from "@nativescript/angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {IndexComponent} from "./index/index.component";
import {AdduserComponent} from "./adduser/adduser.component";
import {LoginComponent} from "./login/login.component";
import {TokenInterceptor} from "../intercepter/intercptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HomeComponent} from "./home/home.component";
import {OfertaMaterialComponent} from "./oferta-material/oferta-material.component";
import {PutuserComponent} from "./putuser/putuser.component";
import {RedefinirSenhaComponent} from "./redefinir-senha/redefinir-senha.component";
import {FloatLabel} from "../styles/float-label";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        NativeScriptFormsModule,
    ],
    declarations: [
        AppComponent,
        IndexComponent,
        AdduserComponent,
        LoginComponent,
        HomeComponent,
        OfertaMaterialComponent,
        PutuserComponent,
        RedefinirSenhaComponent,
        FloatLabel
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
