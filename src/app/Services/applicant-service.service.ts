import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApplicantServiceService {

  
  constructor(private http: HttpClient) { }
   url:any = environment.baseUrl;
  saveApplicantForm(appObj: any):Observable<any>{
    return this.http.post(this.url+"api/applicant-form",appObj)
  }

  getApplicantFields():Observable<any>{
    return this.http.get(this.url+"api/applicant-form")
  }

  updateApplicantForm(id:any,appObj:any):Observable<any>{
    return this.http.put(this.url+"api/applicant-form/"+id,appObj)
  }

  getApplicantById(id):Observable<any>{
    return this.http.get(this.url+"api/applicant-form/"+id)
  }

  deleteApplicantById(id):Observable<any>{
    return this.http.delete(this.url+"api/applicant-form/"+id);
  }

  sendEmail(id,email):Observable<any>{
    return this.http.post(this.url+"api/applicant-form/"+id+"/"+email,null)
  }

  getPortfolioDataById(id):Observable<any>{
    return this.http.get(this.url+"token/view-portfolio/"+id);
  }
}
