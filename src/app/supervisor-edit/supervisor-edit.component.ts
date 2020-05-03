import { Component, OnInit } from '@angular/core';
import { Timesheet } from '../add-current-timesheets/Timesheet';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-supervisor-edit',
  templateUrl: './supervisor-edit.component.html',
  styleUrls: ['./supervisor-edit.component.css']
})
export class SupervisorEditComponent implements OnInit {

  timesheetsObj: Timesheet = new Timesheet();
  id: any;

  showRange: string;
  weekId: any;
  userImage: string;
  // totalHrs: number = 0;
  totalSumOfTimesheet = {
    hours:0,
    minutes:0
  }
  totalHrs = "0";
  showLoader = false;
  showForm = true;
  userName: string;
  showErrorDiv: boolean;
  disableSaveButton: boolean;
  hrs = {
    monHrs:"00:00",
    tuesHrs:"00:00",
    wedHrs:"00:00",
    thursHrs:"00:00",
    friHrs:"00:00",
    satHrs:"00:00",
    sunHrs:"00:00"
  }
  userType: string;
  type: string;
  constructor(private activateRoute: ActivatedRoute,private service: ApplicantServiceService,private message: NzMessageService,private router: Router) { }

  ngOnInit(): void {
    this.getItemsOnPageLoad();
    this.getTimeSheetById();
    
  }
  logout(){
    this.service.logout(this.router);
  }

  getItemsOnPageLoad(){
    this.id = this.activateRoute.snapshot.params['id'];
    this.userImage = sessionStorage.getItem("userImage");
    this.userName = sessionStorage.getItem("userName")
    this.type = sessionStorage.getItem("userType").toLowerCase();
  this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);

  }

  getTimeSheetById(){
    this.showLoader = true;
    this.showForm = false;
    this.service.getTimesheetById(this.id).subscribe(d=>{
      this.timesheetsObj = d.result;
      this.populateDuration(d.result);
      this.calulateHours()
      this.weekId = d.result.weekId;
     
      this.getRange();
      if(this.timesheetsObj){
        this.showForm = true;
        this.showLoader = false
      }
      else{
        this.showLoader = true;
        this.showForm = false;
      }
      
      

    })
    
  }

  modifyAndApprove(){
    this.timesheetsObj.status = "Approved"
    this.timesheetsObj.dateSubmitted = this.dateFormatedDate(new Date())
    this.service.modifyAndApprove(this.id,this.timesheetsObj).subscribe(d=>{
      if(d.status == 200){
        // this.showLoading = false;
        this.message.success(d.message, {
         nzDuration: 3000
       });
       this.router.navigate(['supervisorview'])
      }
      else{
        // this.showLoading = false;
        this.message.error(d.message, {
          nzDuration: 3000
        });
      }
    })
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
   dateFormatedDate(date){
      return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    }

    getRange(){
      
      this.showRange =  (this.dateFormatedDate(this.getStartingDay(this.weekId,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekId,new Date().getFullYear())))
    }

    goToRecievedTimesheets(){
      this.router.navigate(['supervisorview'])
    }

    goToProfiles(){
      this.router.navigate(['applicantForm'])
    }
    goToPreviousTimesheets(){
      this.router.navigate(['previoustimesheets'])
    }

    getFormattedDate(time){
      let date = new Date();
     
       return (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time);
  
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

  setStartMyDate(event,day,end,dayHrs){
        
    console.log(event,day)
    this.timesheetsObj[day] = this.getHrsAndMins(event);
    if(this.getDuration(this.timesheetsObj[day],end) === "Error") {
      this.showErrorDivAndDisableBtn();
      this.hrs[dayHrs] = this.getDuration(this.timesheetsObj[day],end)
    }
                
    else{
      this.hideErrorDivAndEnableBtn();
      this.hrs[dayHrs] = this.getDuration(this.timesheetsObj[day],end)
    }
   
   this.checkAllHrs()
    
  }
  setEndMyDate(event,day,start,dayHrs){

    this.timesheetsObj[day] = this.getHrsAndMins(event);
   
      if(this.getDuration(start,this.timesheetsObj[day]) === "Error") {
        this.showErrorDivAndDisableBtn();
        this.hrs[dayHrs] = this.getDuration(start,this.timesheetsObj[day])
      }
                  
      else{
        this.hideErrorDivAndEnableBtn();
        this.hrs[dayHrs] = this.getDuration(start,this.timesheetsObj[day])
      }

     
    this.checkAllHrs()

  }

  checkAllHrs(){
    Object.values(this.hrs).forEach((d)=> {
      if(d === "Error"){
        this.showErrorDivAndDisableBtn();
      }
    
  });
  }
  getHrsAndMins(date){
    return date.getHours() +":"+date.getMinutes();
  }
  private hideErrorDivAndEnableBtn() {
    this.showErrorDiv = false;
    this.disableSaveButton = false;
  }

  private showErrorDivAndDisableBtn() {
    this.showErrorDiv = true;
    this.disableSaveButton = true;
  }


  
 
  resetHrs(){
    this.totalSumOfTimesheet.hours = 0;
    this.totalSumOfTimesheet.minutes = 0;
    this.totalHrs = 0 + "Hours,"+ 0 +" Minutes";
  }
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
    }
     
  }
  msToTime(duration: number) {       
    let  minutes = Math.floor((duration / (1000 * 60)) % 60);
    let  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    if(hours < 0|| minutes < 0){
      this.disableSaveButton =true;
      this.showErrorDiv = true;
    }

    let hours2 = hours < 10 ? "0" + hours : hours;
    let minutes2 = minutes < 10 ? "0" + minutes : minutes;
   
    return hours2 + ":" + minutes2;
 }
  
  
initializeHrs(){
  this.hrs.monHrs = "00:00"
  this.hrs.tuesHrs = "00:00"
  this.hrs.wedHrs = "00:00"
  this.hrs.thursHrs = "00:00"
  this.hrs.friHrs = "00:00"
  this.hrs.satHrs = "00:00"
  this.hrs.sunHrs = "00:00"
}

populateDuration(d){
  Object.keys(d).forEach(d=>{
    
    if(d.includes("monday")){
     this.hrs.monHrs = this.getDuration(this.timesheetsObj.mondayStartTime,this.timesheetsObj.mondayEndTime)
     
    }
    else if(d.includes("tuesday")){
      this.hrs.tuesHrs = this.getDuration(this.timesheetsObj.tuesdayStartTime,this.timesheetsObj.tuesdayEndTime)

    }
    else if(d.includes("wednesday")){
      this.hrs.wedHrs = this.getDuration(this.timesheetsObj.wednesdayStartTime,this.timesheetsObj.wednesdayEndTime)

    }
    else if(d.includes("thursday")){
     this.hrs.thursHrs = this.getDuration(this.timesheetsObj.thursdayStartTime,this.timesheetsObj.thursdayEndTime)

    }
    else if(d.includes("friday")){
      this.hrs.friHrs = this.getDuration(this.timesheetsObj.fridayStartTime,this.timesheetsObj.fridayEndTime)

    }
    else if(d.includes("saturday")){
      this.hrs.satHrs = this.getDuration(this.timesheetsObj.saturdayStartTime,this.timesheetsObj.saturdayEndTime)

    }
    else if(d.includes("sunday")){
      this.hrs.sunHrs = this.getDuration(this.timesheetsObj.sundayStartTime,this.timesheetsObj.sundayEndTime)

    }
    console.log(this.hrs)

  })
}
}
