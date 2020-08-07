import { Component, OnInit } from '@angular/core';
import { company } from './company';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';


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
  zoomvalue:any=1;
  checkZoomInOrOut=this.zoomvalue;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  showCropper: boolean;
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
    this.fileChangeEvent(event)
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

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }


 
 

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

 

 
    zoom(a) {

      this.zoomvalue = a;
      this.transform = {
        ...this.transform,
        scale: this.zoomvalue
      };
    }
 

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }




  fileChangeEvent(event: any): void {
    
    this.isVisible = true;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64.replace(/^data:image\/[a-z]+;base64,/, "");

  }




  updateCroppedImage() {
    sessionStorage.removeItem('companyImage');
    this.companyObj.companyimage = this.croppedImage;
    sessionStorage.setItem('companyImage', this.companyObj.companyimage);
    // this.logoChangeObservable.next();
    // console.log(event, base64ToFile(event.base64));
    // base64 to blob file
    this.isVisible = false;
  }

  isVisible = false;



  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    this.companyObj.companyimage = null; 
    console.log('Button cancel clicked!', this.companyObj.companyimage);
    this.isVisible = false;
  }
}
