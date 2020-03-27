import { Component, OnInit } from '@angular/core';
import { adduser } from './adduser';
import { NgForm } from '@angular/forms';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  showLoader = false;
  regexp: RegExp;
  id: any;

  constructor(private activateRoute: ActivatedRoute,private applicantService:ApplicantServiceService,private router:Router,private message: NzMessageService) { }

  ngOnInit() {

    this.id = this.activateRoute.snapshot.params['id'];
    if(this.id){
      this.getUserById()
    }
    this.userImage = sessionStorage.getItem("companyImage");
    this.adduserobj.organizationName = sessionStorage.getItem("organizationName")
  }
  goToProfiles(){
    this.router.navigate(['applicantForm'])
  }
  goToUserTable(){
    this.router.navigate(['viewusers'])
  }
  
  logout(){
    this.applicantService.logout(this.router);
  }

  submit(myForm:NgForm){
    this.showLoader = true;
    console.log(this.adduserobj);

    if(this.id){

      this.applicantService.editUser(this.id,this.adduserobj).subscribe(d=>{
        if(d.status == 200){
          
          this.getUserById();
          this.showLoader = false;
          // this.adduserobj.organizationName = sessionStorage.getItem("organizationName")
          this.message.success("User updated successfully", {
            nzDuration: 3000
          });
        }
        else{
          this.showLoader = false;
            this.message.error("Error updating user", {
              nzDuration: 3000
            });
         
        }
      })
    }
    else{
      this.applicantService.saveUserForm(this.adduserobj).subscribe(d=>{
        if(d.status == 200){
          
          this.reset();
          this.showLoader = false;
          // this.adduserobj.organizationName = sessionStorage.getItem("organizationName")
          this.message.success(d.message, {
            nzDuration: 3000
          });
        }
        else{
          this.showLoader = false;
            this.message.error(d.message, {
              nzDuration: 3000
            });
         
        }
        console.log(d);
       
      })
    }
    

  }
  reset() {
    this.adduserobj.email = null;
    this.adduserobj.name = null;
    this.adduserobj.password = null;
    this.adduserobj.userType = null;
   

  }

  goToOrganizationConfig(){
    this.router.navigate(['companyprofile'])
  }

  goToAddNewUser(){
    this.router.navigate(['adduser'])
  }

  getUserById(){
    this.applicantService.getUserById(this.id).subscribe(d=>{
      this.adduserobj = d.result;
    })
  }

  

}

