import { Component, OnInit } from '@angular/core';
import { company } from './company';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';


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
  userImage: string;
  constructor(private applicantService:ApplicantServiceService,private router:Router,private message: NzMessageService) { }

  ngOnInit() {
    this.userImage = sessionStorage.getItem("userImage");
  }

  logout(){
    this.applicantService.logout(this.router);
  }

  goToProfiles(){
    this.router.navigate(['applicantForm'])
  }
  submit(myForm:NgForm){
    console.log(this.companyObj);
    this.applicantService.saveCompanyProfile(this.companyObj).subscribe(d=>{
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

  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           let base64textString= btoa(binaryString);
           //console.log(btoa(binaryString));
           this.companyObj.companyimage = base64textString;
          // console.log(this.appFormObj.resume)
          console.log(this.companyObj.companyimage) 
           
   }
   onImageChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderImageLoaded.bind(this);

      this.companyObj.companyimage = file.type
      console.log( this.companyObj.companyimage)
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }

  }
}
