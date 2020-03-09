import { Component, OnInit } from '@angular/core';
import { company } from './company';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

   companyObj: company= new company();
   disableSaveButton=false;
   days: any[] = [
     
     {value:"Monday",viewValue:"Monday"},
     {value:"Tuesday",viewValue:"Tuesday"},
     {value:"Wednesday",viewValue:"Wednesday"},
     {value:"Thursday",viewValue:"Thursday"},
     {value:"Friday",viewValue:"Friday"},
     {value:"Saturday",viewValue:"Saturday"},
     {value:"Sunday",viewValue:"Sunday"},


   
  ]
  constructor(private applicantService:ApplicantServiceService,private router:Router) { }

  ngOnInit() {
  }

  submit(myForm:NgForm){

    console.log(this.companyObj);

    this.applicantService.saveCompanyProfile(this.companyObj).subscribe(d=>{
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
