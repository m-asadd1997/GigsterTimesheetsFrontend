import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  checkUserandPass(name: string, pwd: string):Observable <any> {
    let user = {
      username:name,
      password:pwd
    }
    
    return this.http.post(environment.baseUrl+"token/generate-token",user);
      
    
  }
}

