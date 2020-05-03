import { Component, OnInit } from '@angular/core';
import { NewPassword } from './newpassword';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

  passwordVisible = false;
  password: string;
  showLoader = false;
  showFiels = true;
  mainLoader = true;;
  newPassObj: NewPassword = new NewPassword();
  
  constructor(private service:ApplicantServiceService,private message: NzMessageService,private router: Router,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkTokenExpiry()
  }

  checkTokenExpiry(){
    this.mainLoader = true;
    this.newPassObj.token = this.activateRoute.snapshot.params['token'];
    this.newPassObj.date = new Date();
    this.service.checkTokenExpiry(this.newPassObj).subscribe(d=>{
      if(d.status == 200){
        this.newPassObj.email = d.result.email;
        this.showFiels = true;
        this.mainLoader = false;
       
      }
      else{
        this.showFiels = false;
        this.mainLoader = false;
      }
    })
  }

  savePassword(){
    if(this.password === this.newPassObj.password){
      this.showLoader = true;
    this.service.saveNewPassword(this.newPassObj).subscribe(d=>{
      if(d.status == 200){
        this.message.success(d.message, {
          nzDuration: 4000
        });
        this.showLoader = false;
       
        setTimeout(()=>this.router.navigate(['']),3000)
      }
      else{
        this.message.error(d.message, {
          nzDuration: 4000
        });
        this.showLoader = false;
      }
    })
    }
    else{
      this.password = null;
      this.message.error("New password and confirm password are not same", {
        nzDuration: 4000
      });
    }

    }
    
    // dateFormatedDate(date){
    //   return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    // }

    goToForgotPassword(){
      this.router.navigate(['forgotPassword']);
    }

    goToLogin(){
      this.router.navigate(['']);
    }
}


