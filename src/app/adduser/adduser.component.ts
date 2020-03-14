import { Component, OnInit } from '@angular/core';
import { adduser } from './adduser';
import { NgForm } from '@angular/forms';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';




@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  disableSaveButton: boolean = false;
  hide = true;

  adduserobj: adduser= new adduser();
  userImage: string;

  constructor(private applicantService:ApplicantServiceService,private router:Router,private message: NzMessageService) { }

  ngOnInit() {

    this.userImage = sessionStorage.getItem("userImage");
    this.adduserobj.organizationName = sessionStorage.getItem("organizationName")
  }
  goToProfiles(){
    this.router.navigate(['applicantForm'])
  }
  
  logout(){
    this.applicantService.logout(this.router);
  }

  submit(myForm:NgForm){

    console.log(this.adduserobj);

    this.applicantService.saveUserForm(this.adduserobj).subscribe(d=>{
      if(d.status == 200){
        this.message.success(d.message, {
          nzDuration: 3000
        });
      }
      else{
        
          this.message.error(d.message, {
            nzDuration: 3000
          });
       
      }
      console.log(d);
      myForm.reset();
    })

  }

  goToOrganizationConfig(){
    this.router.navigate(['companyprofile'])
  }

  goToAddNewUser(){
    this.router.navigate(['adduser'])
  }

}

