import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';


@Component({
  selector: 'app-viewportfolio',
  templateUrl: './viewportfolio.component.html',
  styleUrls: ['./viewportfolio.component.css']
})
export class ViewportfolioComponent implements OnInit {
  id: any;
  applicantObj;
  showLoading = false;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'myTableElementId', // the id of html/table element
  }
  

  
  
  constructor(private exportAsService: ExportAsService,private router: Router,private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];
    if(this.id)
    this.getPortfolioDataById(this.id)
    this.checkToken();
    console.log("token para hai",sessionStorage.getItem('token'))
  }

  getPortfolioDataById(id: any){
    this.showLoading = true;
    this.applicantService.getPortfolioDataById(id).subscribe(d=>{
       this.applicantObj = (d.result)
       if(this.applicantObj){
         this.showLoading = false;
       }
       else{
         this.showLoading = true;
       }
       console.log(this.applicantObj)
      
    })
    
  }

  goToapplicantTable(){
    this.router.navigate(['browseProfiles'])
  }

  goToNewProfiles(){
    this.router.navigate(['applicantForm'])
  }

   exportFile(type) {
     console.log("hello")
     this.exportAsConfig.type = type;
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'myFile').subscribe(() => {
      // save started
    });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
   
  }

  downloadFile(){
    
    const extension =this.getMIMEtype(this.applicantObj['resumeContentType']);
    const source =  "data:"+extension +";base64,"+this.applicantObj["resume"];//new Blob([this.applicantObj["resume"]], { type: this.getMIMEtype(this.applicantObj['resumeContentType']) });
    const downloadLink = document.createElement("a");
    const fileName = "download."+extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);
  }

  logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');

    this.router.navigate(['']);
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
 
 
checkToken(){
  if(sessionStorage.getItem('token')){
    return true;
  }
  else{
    return false;
  }
}

}
