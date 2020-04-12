import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import {IndexComponent} from "~/app/index/index.component";
import {LoginComponent} from "~/app/login/login.component";
import {AdduserComponent} from "~/app/adduser/adduser.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "index", component: IndexComponent },
    { path: "login", component: LoginComponent },
    { path: "adduser", component: AdduserComponent },
    // { path: "item/:id", component: ItemDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
