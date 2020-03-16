import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Register } from './Register';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  repeatPassword:any;
  registerObj: Register = new Register();
  showLoading: boolean;
  constructor(private router:Router,private service: ApplicantServiceService, private message: NzMessageService) { }

  ngOnInit(): void {
  }

  routeToLogin(){
    this.router.navigate([""])
  }

  registerUser(){
    this.showLoading = true;
    this.registerObj.active = true;
    this.registerObj.userType="ADMIN";
    this.service.registerUser(this.registerObj).subscribe(d=>{
      // this.message.success('amount added successfully', {
      //   nzDuration: 3000
      // });
      if(d.status == 200){
        this.showLoading = false;
        this.message.success(d.message, {
         nzDuration: 3000
       });
       this.router.navigate(['']);
      }
      else{
        this.showLoading = false;
        this.message.error(d.message, {
          nzDuration: 3000
        });
      }
      console.log(d)
    })

  }


}
