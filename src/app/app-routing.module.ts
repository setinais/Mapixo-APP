import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import {IndexComponent} from "~/app/index/index.component";
import {LoginComponent} from "~/app/login/login.component";
import {AdduserComponent} from "~/app/adduser/adduser.component";
import {HomeComponent} from "~/app/home/home.component";
import {AppAuthGuard} from "~/app/app-auth-guard";
import {PutuserComponent} from "~/app/putuser/putuser.component";
import {RedefinirSenhaComponent} from "~/app/redefinir-senha/redefinir-senha.component";
import {OfertaMaterialComponent} from "~/app/oferta-material/oferta-material.component";

const routes: Routes = [
    { path: "", redirectTo: "/ofertamaterial", pathMatch: "full" },
    { path: "index", component: IndexComponent },
    { path: "login", component: LoginComponent },
    { path: "adduser", component: AdduserComponent },
    { path: "home", component: HomeComponent, canActivate: [AppAuthGuard]},
    { path: "putuser", component: PutuserComponent, canActivate: [AppAuthGuard]},
    { path: "putpassword", component: RedefinirSenhaComponent, canActivate: [AppAuthGuard]},
    { path: "ofertamaterial", component: OfertaMaterialComponent, canActivate: [AppAuthGuard]},
    // { path: "item/:id", component: ItemDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
