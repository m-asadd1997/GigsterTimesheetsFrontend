import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Forgotpassword } from './forgotpassword';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  showError = false;
  fObj: Forgotpassword = new Forgotpassword();
  showForm = true;
  showLoader = false;
  alertText;
  constructor(private router: Router,private service:ApplicantServiceService,private message: NzMessageService) { }

  ngOnInit(): void {
  }

  goToLogin(){
    this.router.navigate([''])
  }

  sendEmail(){
    this.showLoader = true;
    this.service.sendMailOnForgetPassword(this.fObj).subscribe(d=>{
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
}
