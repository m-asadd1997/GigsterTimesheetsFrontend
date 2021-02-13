import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Timesheet } from '../add-current-timesheets/Timesheet';

@Component({
  selector: 'app-previous-timesheets',
  templateUrl: './previous-timesheets.component.html',
  styleUrls: ['./previous-timesheets.component.css']
})
export class PreviousTimesheetsComponent implements OnInit {
  tableData:any[] = [];
  showLoader = false;
  displayedColumns: string[] = ['id', 'status', 'lastModifiedBy','modifiedAt', 'week','sentBy','action'];
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;

  userImage: string;
  userName: string;
  userType: string;
  supId: string;
  weekIdforView: any;
  showRangeForView: string;
  type: string;
  disableDownloadAll: boolean = false;
  viewTimesheetName :string;

  constructor(private router:Router,private service: ApplicantServiceService) { }

  ngOnInit(): void {
    this.getItemsOnPageLoad();
    this.getTimesheets();
  }
  getItemsOnPageLoad(){
   
    this.userImage = sessionStorage.getItem("userImage");
    this.userName = sessionStorage.getItem("userName")
    this.type = sessionStorage.getItem("userType").toLowerCase();
  this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);

  }
  goToProfiles(){
    this.router.navigate(['applicantForm'])
  }
  
  goToPreviousTimesheets(){
    this.router.navigate(['previoustimesheets'])
  }
  goToCurrentTimesheets(){
    this.router.navigate(['supervisorview'])
  }
  logout(){
    this.service.logout(this.router);
  }

  getTimesheets(){
    this.showLoader = true;
    this.tableData = [];
    this.supId = sessionStorage.getItem("userId");
    this.service.getApprovedTimesheets(this.supId).subscribe(d=>{
      
      // this.tableData = d.result;
    d.result.map(d=>{
      this.weekIdforView = d.weekId;
      this.getRangeForView();
      this.tableData.push({
        id:d.id,
        status:d.status,
        modifiedBy:d.modifiedBy,
        modifiedAt:d.dateSubmitted,
        sentBy:d.user.name,
        week:this.showRangeForView,
        modifierImage:d.modifiedByImage,
        modifiedId:d.modifiedId,
        sentById:d.user.id

      })
    })
      
     this.checkTableData()
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
    })
    
  }

  checkTableData(){
    if(this.tableData.length)
      {
        this.disableDownloadAll = false;
        this.showLoader = false;
      }
      else{
        this.disableDownloadAll = true;
        this.showLoader = false
      }
      console.log(this.disableDownloadAll);
      
  }

  getRangeForView(){
 
    this.showRangeForView =  (this.dateFormatedDate(this.getStartingDay(this.weekIdforView,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekIdforView,new Date().getFullYear())))
  }
  dateFormatedDate(date){
    return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
  }

  getStartingDay( weeks, year ) {
    var d = new Date(year, 0, 1);
    var dayNum = d.getDay();
    var requiredDate = --weeks * 7;
    if (((dayNum!=0) || dayNum > 4)) {
        var start = requiredDate;
        requiredDate += 6;
     }
    d.setDate(1 - d.getDay() + ++start );
    return d;
  }
  getEndingDay( weeks, year ) {
    var d = new Date(year, 0, 1);
    var dayNum = d.getDay();
    var requiredDate = --weeks * 7;
    if (((dayNum!=0) || dayNum > 4)) {
       
        requiredDate += 6;
     }
  
    d.setDate(1 - d.getDay() + ++requiredDate );
    return d;
  }

 

  downloadAll(){
    this.downloadTimesheet(this.supId,'yesprev')
  }
  
  
  downloadTimesheet(id,isAll){
    this.showLoader = true;
      this.service.downloadPDF(id,isAll).subscribe(d => { 
        this.showLoader = false; 
        console.log("Blob", d);
        let url = window.URL.createObjectURL(d);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        let all = isAll == "yesprev" ? "all" : "00"+id;
        let name =  "TS"+new Date().getFullYear().toString()+"-"+ all;
        a.download = name
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      })
  
  }

timesheetsObj: Timesheet = new Timesheet();
weekId: any;
paid :Boolean;
showLoaderForView = false;
viewTimesheet(id){
  this.viewTimesheetName = "TS00"+id+" - ";
  this.showModal()
  // this.router.navigate(['viewapprovedtimesheet/'+id]);
  this.showLoaderForView = true;
   
    this.service.getTimesheetById(id).subscribe(d=>{
      this.timesheetsObj = d.result;
      this.viewTimesheetName += this.timesheetsObj.user.name
      this.paid = d.result.user.paid
      this.populateDuration(d.result);
      this.calulateHours()
      this.weekId = d.result.weekId;
     
      this.getRangeForView();
      console.log(this.timesheetsObj)
      if(this.timesheetsObj){
       
        this.showLoaderForView = false
      }
      else{
        this.showLoaderForView = true;
        
      }
      
      

    })
}

hrs = {
  monHrs:"00:00",
  tuesHrs:"00:00",
  wedHrs:"00:00",
  thursHrs:"00:00",
  friHrs:"00:00",
  satHrs:"00:00",
  sunHrs:"00:00"
}

totalSumOfTimesheet = {
  hours:0,
  minutes:0
}
totalHrs = "0";

calulateHours(){
  //hours
  this.resetHrs()
  if(this.hrs.monHrs && this.hrs.tuesHrs && this.hrs.wedHrs && this.hrs.thursHrs && this.hrs.thursHrs && this.hrs.friHrs && this.hrs.satHrs && this.hrs.sunHrs)
  {
    Object.keys(this.hrs).forEach(d=>{
         this.totalSumOfTimesheet.hours += (parseInt(this.hrs[d].split(":")[0]))
         this.totalSumOfTimesheet.minutes += (parseInt(this.hrs[d].split(":")[1]))
    })
     while(this.totalSumOfTimesheet.minutes >= 60){
        this.totalSumOfTimesheet.hours++;
        this.totalSumOfTimesheet.minutes -= 60;
      }
    this.totalHrs = this.totalSumOfTimesheet.hours + " Hours, "+this.totalSumOfTimesheet.minutes + " Minutes";
    this.timesheetsObj.totalHrs = this.totalHrs;
  }

  
   
}
resetHrs(){
  this.totalSumOfTimesheet.hours = 0;
  this.totalSumOfTimesheet.minutes = 0;
  this.totalHrs = 0 + "Hours,"+ 0 +" Minutes";
}

populateDuration(d){
  Object.keys(d).forEach(d=>{
    
    if(d.includes("monday")){
     this.hrs.monHrs = this.getDuration(this.timesheetsObj.mondayStartTime,this.timesheetsObj.mondayEndTime)
     this.hrs.monHrs = this.calculateHrsAtPageLoad(this.hrs.monHrs,this.timesheetsObj.monExtraHrs)

    }
    else if(d.includes("tuesday")){
      this.hrs.tuesHrs = this.getDuration(this.timesheetsObj.tuesdayStartTime,this.timesheetsObj.tuesdayEndTime)
      this.hrs.tuesHrs = this.calculateHrsAtPageLoad(this.hrs.tuesHrs,this.timesheetsObj.tueExtraHrs)

    }
    else if(d.includes("wednesday")){
      this.hrs.wedHrs = this.getDuration(this.timesheetsObj.wednesdayStartTime,this.timesheetsObj.wednesdayEndTime)
      this.hrs.wedHrs = this.calculateHrsAtPageLoad(this.hrs.wedHrs,this.timesheetsObj.wedExtraHrs)

    }
    else if(d.includes("thursday")){
     this.hrs.thursHrs = this.getDuration(this.timesheetsObj.thursdayStartTime,this.timesheetsObj.thursdayEndTime)
     this.hrs.thursHrs = this.calculateHrsAtPageLoad(this.hrs.thursHrs,this.timesheetsObj.thursExtraHrs)

    }
    else if(d.includes("friday")){
      this.hrs.friHrs = this.getDuration(this.timesheetsObj.fridayStartTime,this.timesheetsObj.fridayEndTime)
      this.hrs.friHrs = this.calculateHrsAtPageLoad(this.hrs.friHrs,this.timesheetsObj.friExtraHrs)

    }
    else if(d.includes("saturday")){
      this.hrs.satHrs = this.getDuration(this.timesheetsObj.saturdayStartTime,this.timesheetsObj.saturdayEndTime)
      this.hrs.satHrs = this.calculateHrsAtPageLoad(this.hrs.satHrs,this.timesheetsObj.satExtraHrs)

    }
    else if(d.includes("sunday")){
      this.hrs.sunHrs = this.getDuration(this.timesheetsObj.sundayStartTime,this.timesheetsObj.sundayEndTime)
      this.hrs.sunHrs = this.calculateHrsAtPageLoad(this.hrs.sunHrs,this.timesheetsObj.sunExtraHrs)

    }
    console.log(this.hrs)

  })
}

getDuration(startTime,event) {
      
  let d1 = new Date(this.getFormattedDate(startTime))
  if(!d1)
  return;

  let d2 = new Date(this.getFormattedDate(event))
 
  if((d2.getTime()-d1.getTime()) < 0){
 
    return "Error";
   }
  let durationsHours = this.msToTime(d2.getTime()-d1.getTime());

  
  return durationsHours;
}

msToTime(duration: number) {       
  let  minutes = Math.floor((duration / (1000 * 60)) % 60);
  let  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  if(hours < 0|| minutes < 0){
    // this.disableSaveButton =true;
    // this.showErrorDiv = true;
  }

  let hours2 = hours < 10 ? "0" + hours : hours;
  let minutes2 = minutes < 10 ? "0" + minutes : minutes;
 
  return hours2 + ":" + minutes2;
}

getFormattedDate(time){
  let date = new Date();
 
   return (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time);

}

calculateHrsAtPageLoad(dayHrs,extraHrs){
  let hrs = 0, min = 0;
  hrs = (parseInt(dayHrs.split(":")[0])) + (parseInt(extraHrs.split(":")[0]))
  min = (parseInt(dayHrs.split(":")[1])) + (parseInt(extraHrs.split(":")[1]))
  while(min >= 60){
    hrs++;
    min -= 60;
  }
  let hours2 = hrs < 10 ? "0" + hrs : hrs;
  let minutes2 = min < 10 ? "0" + min : min;
  
   return hours2+ ":" +minutes2;
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
  console.log('Button cancel clicked!');
  this.isVisible = false;
}

goToViewProfile(id){
  this.router.navigate(['viewprofile/',id])
}

}
