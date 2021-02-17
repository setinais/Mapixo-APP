import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import {IndexComponent} from "./index/index.component";
import {LoginComponent} from "./login/login.component";
import {AdduserComponent} from "./adduser/adduser.component";
import {AppAuthGuard} from "./app-auth-guard";
import {HomeComponent} from "./home/home.component";
import {RedefinirSenhaComponent} from "./redefinir-senha/redefinir-senha.component";
import {PutuserComponent} from "./putuser/putuser.component";
import {OfertaMaterialComponent} from "./oferta-material/oferta-material.component";
import {HomeDetailComponent} from "./home-detail/home-detail.component";
import {MyOfertasComponent} from "./my-ofertas/my-ofertas.component";
import {MyOfertasEditComponent} from "./my-ofertas-edit/my-ofertas-edit.component";


const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "index", component: IndexComponent },
    { path: "login", component: LoginComponent },
    { path: "adduser", component: AdduserComponent },
    { path: "home", component: HomeComponent, canActivate: [AppAuthGuard]},
    { path: "putuser", component: PutuserComponent, canActivate: [AppAuthGuard]},
    { path: "putpassword", component: RedefinirSenhaComponent, canActivate: [AppAuthGuard]},
    { path: "ofertamaterial", component: OfertaMaterialComponent, canActivate: [AppAuthGuard]},
    { path: "home-detail", component: HomeDetailComponent, canActivate: [AppAuthGuard]},
    { path: "my-ofertas", component: MyOfertasComponent, canActivate: [AppAuthGuard]},
    { path: "my-ofertas-edit/:id", component: MyOfertasEditComponent, canActivate: [AppAuthGuard]},
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
