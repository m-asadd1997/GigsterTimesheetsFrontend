import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantForm } from '../main-screen/ApplicantForm';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  userName: string;
  userType: string;
  type: string;
  id : any;
  userImage: string;
  profileUserName;
  profileEmail;
  phoneNumber;
  gender;
  constructor(private activateRoute: ActivatedRoute,private _location: Location,private service: ApplicantServiceService,private router:Router) { }

  ngOnInit(): void {
    this.getItemsOnPageLoad();
    if(this.id)
      this.getUserById(this.id)
  }

  getItemsOnPageLoad(){
    this.userImage = sessionStorage.getItem("userImage");
    this.id = this.activateRoute.snapshot.params['id'];
    this.userName = sessionStorage.getItem("userName")
    this.type = sessionStorage.getItem("userType").toLowerCase();
    this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);
  }

  appFormObj: ApplicantForm = new ApplicantForm();
  getProfileByEmail(checkEmail){
    this.service.getProfilesByCheckEmail(checkEmail).subscribe(d=>{
    if(d.status == 200 && d.result){
      this.appFormObj = d.result;
      this.loader = false;
    }
    else{
      this.loader = false;
    }

    })
  }
  loader = false
  getUserById(id){
    this.loader = true;
    this.service.getUserById(id).subscribe(d=>{
      if(d.status == 200 && d.result){
        this.profileUserName = d.result.name
        this.profileEmail = d.result.email
        this.getProfileByEmail(d.result.email)
      }
      else{
        console.log("Email Not Found");
        
      }  
    })
  }

   goBack()
  {
   this._location.back();
  }
  logout(){
    this.service.logout(this.router);
  }
}
