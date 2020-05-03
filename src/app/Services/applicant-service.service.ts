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

   logout(router){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('organizationName');
    sessionStorage.removeItem('userImage');
    sessionStorage.removeItem('companyImage')
    sessionStorage.removeItem('userName')
     router.navigate(['']);
  }

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
    return this.http.post(this.url+"token/registeradmin",registerObj);
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


  getTimesheetByWeekId(id,userId):Observable<any>{
    return this.http.get(this.url+"api/timesheets/weekid/"+id+"/"+userId);
  }

  getProfilesByCheckEmail(checkEmail):Observable<any>{
    return this.http.get(this.url+"api/checkemail/"+checkEmail)
  }

  getUsersByOrganizationName(organizationName):Observable<any>{
    return this.http.get(this.url+"token/getusers/"+organizationName);
  }

  deleteusers(id):Observable<any>{
    return this.http.delete(this.url+"token/deleteusers/"+id);
  }

  editUser(id,user):Observable<any>{
    return this.http.put(this.url+"token/update/"+id,user);
  }

  getUserById(id):Observable<any>{
    return this.http.get(this.url+"token/getbyid/"+id);
  }

  sendToSupervisor(id,obj):Observable<any>{
    return this.http.put(this.url+"api/timesheets/sendtosupervisor/"+id,obj);
  }

  getCompanyProfiles(organizationName):Observable<any>{
    return this.http.get(this.url+"api/companyprofile/"+organizationName);
  }

  editCompanyProfile(id,obj):Observable<any>{
    return this.http.put(this.url+"api/companyprofile/"+id,obj);
  }

  getApprovedTimesheets(id):Observable<any>{
    return this.http.get(this.url+"api/timesheets/approved/"+id);
  }

  sendMailOnForgetPassword(obj):Observable<any>{
    return this.http.post(this.url+"api/forgotpassword/empandsup",obj)
  }

  checkTokenExpiry(obj):Observable<any>{
    return this.http.post(this.url+"api/forgotpassword/checkexpiry",obj)
  }

  saveNewPassword(obj):Observable<any>{
    return this.http.post(this.url+"api/forgotpassword/savepass",obj)
  }

}
