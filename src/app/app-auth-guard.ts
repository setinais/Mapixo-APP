import {Injectable} from '@angular/core';
import {CanActivate} from "@angular/router";
import {getString} from "@nativescript/core/application-settings";
import {RouterExtensions} from "@nativescript/angular";


@Injectable({
    providedIn: 'root'
})
export class AppAuthGuard implements CanActivate{

    constructor(private router: RouterExtensions) { }

    canActivate() {
        if (getString("token")) {
            return true
        } else {
            this.router.navigate(['/login'])
            return false
        }
    }
}
