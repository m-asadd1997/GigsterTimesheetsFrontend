import { Component, OnInit } from '@angular/core';
import { company } from './company';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

   companyObj: company= new company();
   disableSaveButton=false;
  constructor(private applicantService:ApplicantServiceService) { }

  ngOnInit() {
  }

  submit(myForm:NgForm){

    console.log(this.companyObj);

    this.applicantService.saveCompanyProfile(this.companyObj).subscribe(d=>{
      console.log(d);
      myForm.reset();
    })
  }

}
