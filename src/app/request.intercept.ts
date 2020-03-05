import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable,throwError,of  } from "rxjs";
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
// import { nextContext } from "@angular/core/src/render3";

@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  constructor(private router:Router){}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log("hello interceptor");


      if(sessionStorage.length>0){
        const changedReq = req.clone({headers: req.headers.set('Authorization', sessionStorage.getItem('token'))});
        return next.handle(changedReq).pipe(
          map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                  console.log('event--->>>', event);
              }
              return event;
          }),catchError((error: any) => {
            if(error instanceof HttpErrorResponse) {
                    console.log(error);
                    if(error.status == 401)
                    this.router.navigate(['']);
            }
            return of(error);
        })
        
        
        );
      }else{
        // // sessionStorage.clear();
        // this.router.navigate(['']);
         const changedReq = req.clone({headers: req.headers.set('Content-Type', 'application/json')});
        // const changedReq = req.clone();
         //return next.handle(changedReq);

         return next.handle(changedReq).pipe(
          map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                  console.log('event--->>>', event);
              }
              return event;
          }));
      }


  }
}
