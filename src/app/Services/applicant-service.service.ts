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

  saveUserForm(adduserObj:any):Observable<any>{
  return this.http.post(this.url+"token/user",adduserObj)
  }

  saveCompanyProfile(addCompanyProfile:any):Observable<any>{
    return this.http.post(this.url+"api/companyprofile/",addCompanyProfile)
  }

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

  getUserByEmail(email):Observable<any>{
    return this.http.get(this.url+"token/user/"+email);
  }

  getSupervisors(organizationName):Observable<any>{
    return this.http.get(this.url+"token/"+organizationName);
  }

  registerUser(registerObj:any):Observable<any>{
    return this.http.post(this.url+"token/user",registerObj);
  }

  saveTimesheets(timesheetObj):Observable<any>{
    return this.http.post(this.url+"api/timesheets/",timesheetObj)
  }

  getTimesheetsForUser(id):Observable<any>{
    return this.http.get(this.url+"api/timesheets/employee/"+id)
  }

  getTimesheetById(id):Observable<any>
  {
    return this.http.get(this.url+"api/timesheets/"+id);
  }

  getTimesheetsForSupervisor(id):Observable<any>{
    return this.http.get(this.url+"api/timesheets/supervisor/"+id)
  }

  changeTimesheetStatus(id,status):Observable<any>
  {
    return this.http.get(this.url+"api/timesheets/"+status+"/"+id);
  }

  modifyAndApprove(id,obj):Observable<any>{
    return this.http.put(this.url+"api/timesheets/"+id,obj)
  }
}
