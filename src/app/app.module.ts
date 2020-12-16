import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptFormsModule} from "nativescript-angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { AdduserComponent } from './adduser/adduser.component';
import { HomeComponent } from './home/home.component';
import {TokenInterceptor} from "~/intercepter/intercptor";
import {PutuserComponent} from "~/app/putuser/putuser.component";
import {RedefinirSenhaComponent} from "~/app/redefinir-senha/redefinir-senha.component";
import {FloatLabel} from "~/styles/float-label";
import { OfertaMaterialComponent } from './oferta-material/oferta-material.component';
import { LocalizacaoModalComponent } from './oferta-material/localizacao-modal/localizacao-modal.component';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        AppRoutingModule,
        HttpClientModule,
        // InputMaskModule,
    ],
    declarations: [
        AppComponent,
        IndexComponent,
        LoginComponent,
        AdduserComponent,
        HomeComponent,
        PutuserComponent,
        RedefinirSenhaComponent,
        OfertaMaterialComponent,
        LocalizacaoModalComponent,
        FloatLabel,
        OfertaMaterialComponent,
        LocalizacaoModalComponent
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
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
