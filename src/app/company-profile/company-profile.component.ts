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
  id:any;
  loader: boolean;
  showForm: boolean;
  showLoader: boolean;
  companyImage:string;
  constructor(private applicantService:ApplicantServiceService,private router:Router,private message: NzMessageService) { }

  ngOnInit() {
    
    this.companyObj.companyName = sessionStorage.getItem("organizationName")

    if(this.companyObj.companyName){
      this.getCompanyByCompanyName();
    }
  }

  logout(){
    this.applicantService.logout(this.router);
  }
  goToUserTable(){
    this.router.navigate(['viewusers'])
  }

  goToProfiles(){
    this.router.navigate(['applicantForm'])
  }
  submit(myForm:NgForm){
    this.showLoader = true;

      this.companyImage = this.companyObj.companyimage;
    
    
    console.log(this.companyObj);
    if(this.id){
      this.applicantService.editCompanyProfile(this.id,this.companyObj).subscribe(d=>{
        if(d.status == 200){
          this.message.success(d.message, {
            nzDuration: 3000
          });
          this.getCompanyByCompanyName();
          this.showLoader = false;
        }
        else{
          
          this.showLoader = false;
            this.message.error(d.message, {
              nzDuration: 3000
            });
         
        }
      })
    }
    else{
      this.applicantService.saveCompanyProfile(this.companyObj).subscribe(d=>{
        if(d.status == 200){
          this.message.success(d.message, {
            nzDuration: 3000
          });
          this.getCompanyByCompanyName();
          this.showLoader = false;
        }
        else{
          
          this.showLoader = false;
            this.message.error(d.message, {
              nzDuration: 3000
            });
         
        }
        console.log(d);
        myForm.reset();
      })
    }
    
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
      if(event.target.files[0].size > 5000000){
        this.message.error("image size cannot be greater than 5mb", {
          nzDuration: 3000
        });
        this.disableSaveButton = true;
      }
      else{
        this.disableSaveButton = false;
      }
      console.log(event.target.files[0].size)
      reader.onload =this._handleReaderImageLoaded.bind(this);

      this.companyObj.companyimage = file.type
      console.log( this.companyObj.companyimage)
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }

  }

  getCompanyByCompanyName(){
    this.loader = true;
    this.showForm = false;
    this.applicantService.getCompanyProfiles(this.companyObj.companyName).subscribe(d=>{
     
      if(d.status == 200){
        this.companyObj = d.result
        this.id=d.result.id;
        this.companyImage = d.result.companyimage;
        sessionStorage.setItem("companyImage",this.companyImage)
        console.log("haiii")
        this.loader = false;
        this.showForm = true;
      }
      else{
        this.loader = false;
        this.showForm = true;
      }
    })
  }
}
