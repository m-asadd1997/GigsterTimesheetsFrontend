import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { ApplicantForm } from './ApplicantForm';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

import {Location} from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd';
import { error } from '@angular/compiler/src/util';
import { ImageCroppedEvent, Dimensions, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  resume:File;
  photo:File;
  id : any;
  responseStatus = false;
  responseId :any;
  responseEmail : any;
  recieverEmailFlag = true;

  foods: any[] = [
    {value: 'yes', viewValue: 'Yes'},
    {value: 'no', viewValue: 'No'}
  ];
  Gender: any[] = [
    {value: 'male', viewValue: 'male'},
    {value: 'female', viewValue: 'female'}
  ];

  appFormObj: ApplicantForm = new ApplicantForm();
  closeResult: string;
  durationInSeconds: number;
  success = "Success";
  showloading = false;
  showSaveLoading = false;
  disableSaveButton: boolean = false;
  checkEmail: string;
  userImage: string;
  showForm: boolean = true;
  loader = false;
  userName: string;
  userType: string;
  type: string;
  zoomvalue:any=1;
  checkZoomInOrOut=this.zoomvalue;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  getImageOnCancel;
  @ViewChild('openModal', { static: true }) openModal: ElementRef
  showCropper: boolean;
  constructor(private message: NzMessageService,private _snackBar: MatSnackBar,private router:Router,private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute,private modalService: NgbModal,private _location: Location) { }

  ngOnInit(): void {

    this.getItemsOnPageLoad();

    if(this.checkEmail){
      this.getProfiles()
    }

    if(this.id){
    this.responseStatus = true;
      this.getApplicantById(this.id)
    }
    this.appFormObj.checkEmail = sessionStorage.getItem("email")
      
  }

  getItemsOnPageLoad(){
    this.userImage = sessionStorage.getItem("userImage");
    this.id = this.activateRoute.snapshot.params['id'];
    this.checkEmail = sessionStorage.getItem("email");
    this.userName = sessionStorage.getItem("userName")
    this.appFormObj.name = sessionStorage.getItem("userName")
    this.appFormObj.email = sessionStorage.getItem("email")
    this.type = sessionStorage.getItem("userType").toLowerCase();
    this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getProfiles(){
    this.showForm = false;
    this.loader = true;
    this.applicantService.getProfilesByCheckEmail(this.checkEmail).subscribe(d=>{
      if(d.status ==200){
        this.showForm = true;
        this.loader = false;
        this.appFormObj = d.result;     
      }
      else{
        this.loader= false;
        this.showForm = true;
      }
      
      
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  getApplicantById(id){
    this.applicantService.getApplicantById(id).subscribe(d=>{
      this.appFormObj = d.result;
     
     
    })

  }

  isemailPresent(){
    if(this.appFormObj.recevierEmail){
      return false;
    }
    else{
      return true;
    }
  }
  sendEmail(){
    if(this.id){
      if(this.responseEmail!= null){
        this.showloading = true;
        this.applicantService.sendEmail(this.id,this.responseEmail).subscribe(res=>{
          
          this._snackBar.open(res.message,"X",{duration: 3000});
          this.showloading = false;
         
        });      
      }
      else{      
        this._snackBar.open("Please Provide Email","X",{duration: 3000});
      }
    }else{
      if(this.responseEmail!= null){
        this.showloading = true;
        this.applicantService.sendEmail(this.responseId,this.responseEmail).subscribe(res=>{
          
          this._snackBar.open(res.message,"X",{duration: 3000});
          this.showloading = false;
          if(!this.id){
            this.responseStatus = false;
          }
        });      
      }
      else{      
        this._snackBar.open("Please Provide Email","X",{duration: 3000});
      }
    }
    
   
    
  }


  openFile(){
    document.querySelector('input').click()
  }
  handle(e){
  }

  saveApplicantForm(myForm : NgForm){
   
    
    
    this.appFormObj.checkEmail = this.checkEmail;
    
    // this.responseStatus = true;
    // this.disableSaveButton = true;
    this.responseId = null;
   
    if(this.id){
      this.showSaveLoading = true;
      this.applicantService.updateApplicantForm(this.id,this.appFormObj).subscribe(d=>{
        if(d['status']===200){
          
          try{
            sessionStorage.setItem("userImage",this.appFormObj.userImage);
          }
          catch(e){
            this.showSaveLoading = false;
            this.message.error("Image size is too large, select an image with smaller size", {
              nzDuration: 3000
            });
            console.log(e)
          }
          this.userImage = this.appFormObj.userImage
          this.showSaveLoading = false;
          this.responseId = d['result'].id;
          
          this.responseStatus = true;
          //this.openSnackBar("done")
          this.message.success(d.message, {
            nzDuration: 3000
          });

        }
        else{
          this.responseStatus = false;
          this.showSaveLoading = false;
          this.message.error(d.message, {
            nzDuration: 3000
          });
        }
       
      },error=>{
        this.showloading = false;
        this.message.error("Server error", {
          nzDuration: 3000
        });
      }
      
      )
    }else{
      this.showSaveLoading = true;
      this.applicantService.saveApplicantForm(this.appFormObj).subscribe(d=>{
        if(d['status']===200){
         
          try{
            sessionStorage.setItem("userImage",this.appFormObj.userImage);
          }
          catch(e){
            this.showSaveLoading = false;
            this.message.error("Image size is too large, select an image with smaller size", {
              nzDuration: 3000
            });
            console.log(e)
          }
          this.userImage = this.appFormObj.userImage
          this.showSaveLoading = false;
          this.responseId = d['result'].id;
          this.appFormObj = d.result
          this.responseStatus = true;
          this.message.success(d.message, {
            nzDuration: 3000
          });
          
        }
        else{
          this.responseStatus = false;
          this.showSaveLoading = false;
          this.message.error(d.message, {
            nzDuration: 3000
          });
        }
      }
      ,error=>{
        this.showloading = false;
        this.message.error("Server error", {
          nzDuration: 3000
        });
      })

    }
    
    // this.createBase64String(this.appFormObj);
   

  }

 


_handleReaderLoaded(readerEvt) {
   var binaryString = readerEvt.target.result;
          let base64textString= btoa(binaryString);
          //console.log(btoa(binaryString));
          this.appFormObj.resume = base64textString;
          //console.log(this.appFormObj.resume)
          
  }


  
  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           let base64textString= btoa(binaryString);
           //console.log(btoa(binaryString));
           this.appFormObj.userImage = base64textString;
          // console.log(this.appFormObj.resume)
           
   }      


  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderLoaded.bind(this);
      this.appFormObj.resumeContentType = file.type
     // console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }
  }

  onImageChange(event) {
    
    let reader = new FileReader();
    this.fileChangeEvent(event)
    if(event.target.files && event.target.files.length > 0) {

      let file = event.target.files[0];
      if(event.target.files[0].size > 5000000){
        this.message.error("image size cannot be greater than 5mb", {
          nzDuration: 5000
        });
        this.disableSaveButton = true;
      }
      else{
        this.disableSaveButton = false;
      }
      
      // reader.onload =this._handleReaderImageLoaded.bind(this);
      this.appFormObj.userImage = file.type
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }
  }

  goToapplicantTable(){
    this.router.navigate(['browseProfiles'])
  }

  goToNewProfiles(){
    this.router.navigate(['applicantForm'])
  }

  logout(){
    this.applicantService.logout(this.router);
  }

  downloadFile(){
    
    const extension =this.getMIMEtype(this.appFormObj['resumeContentType']);
    const source =  "data:"+extension +";base64,"+this.appFormObj["resume"];//new Blob([this.applicantObj["resume"]], { type: this.getMIMEtype(this.applicantObj['resumeContentType']) });
    const downloadLink = document.createElement("a");
    const fileName = "download."+extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);
  }

  getMIMEtype(extn){
    let ext=extn.toLowerCase();
    let MIMETypes={
       'text/plain':'txt',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'docx',
       'application/msword':'doc' ,
       'application/pdf':'pdf',
       'image/jpeg':'jpg' ,
       'image/bmp':'bmp' ,
       'image/png':'png' ,
       'application/vnd.ms-excel':'xls' ,
       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx',
       'application/rtf':'rtf' ,
       'application/vnd.ms-powerpoint':'ppt' ,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':'pptx'
    }
    return MIMETypes[ext];
  }

  formValidation(){
    if(this.appFormObj.name && this.appFormObj.phone &&  this.appFormObj.gender &&  this.appFormObj.email){
      return false;
    }
    else{
      return true;
    }
  }


  goBack()
  {
    this._location.back();
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
    sessionStorage.removeItem('userImage');
    this.appFormObj.userImage = this.croppedImage;
    sessionStorage.setItem('userImage', this.appFormObj.userImage);
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
    this.appFormObj.userImage = null; 
    console.log('Button cancel clicked!', this.appFormObj.userImage);
    this.isVisible = false;
  }


}


