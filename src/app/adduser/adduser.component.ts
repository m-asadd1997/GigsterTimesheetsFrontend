import { Component, OnInit } from '@angular/core';
import { adduser } from './adduser';
import { NgForm } from '@angular/forms';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  disableSaveButton: boolean = false;
  hide = true;

  adduserobj: adduser= new adduser();

  constructor(private applicantService:ApplicantServiceService,private router:Router) { }

  ngOnInit() {
  }

  submit(myForm:NgForm){

    console.log(this.adduserobj);

    this.applicantService.saveUserForm(this.adduserobj).subscribe(d=>{
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

