import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApplicantServiceService } from './Services/applicant-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private service:ApplicantServiceService) {}
  // this prevents from getting into another url without login
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (sessionStorage.getItem('token') != null) {
      let userType = sessionStorage.getItem("userType");
      if(next.data[userType]){
        return true;
      }
      else{
        this.service.logout(this.router);
        return false;
      }
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
