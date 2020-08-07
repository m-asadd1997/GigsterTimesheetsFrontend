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
  routeId;

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
  disableInputFields = false;
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
  showBtnLoader= false;
  hideButton = true;
  constructor(private activateRoute: ActivatedRoute,private service: ApplicantServiceService,private message: NzMessageService,private router: Router) { }

  ngOnInit(): void {
    this.getItemsOnPageLoad();
    if(this.id){
      this.getTimeSheetById(this.id);
    }
    else if(this.routeId){
      this.getTimeSheetsForViewOnly();
    }
    
    
  }
  checkExtraHrsField(dayHrs){

    if(this.hrs[dayHrs] == "00:00" || this.hrs[dayHrs] == "Error") return true
    else return false;
  }

  logout(){
    this.service.logout(this.router);
  }

  getTimeSheetsForViewOnly(){
      this.disableInputFields = true;
      this.hideButton = false;
      this.getTimeSheetById(this.routeId)
  }

  getItemsOnPageLoad(){
    this.routeId = this.activateRoute.snapshot.params['routeId']
    this.id = this.activateRoute.snapshot.params['id'];
    this.userImage = sessionStorage.getItem("userImage");
    this.userName = sessionStorage.getItem("userName")
    this.type = sessionStorage.getItem("userType").toLowerCase();
  this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);

  }

  getTimeSheetById(id){
    this.showLoader = true;
    this.showForm = false;
    this.service.getTimesheetById(id).subscribe(d=>{
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
    this.calulateHours();
    this.populateTimesheetObjTotalHrs();
    this.showBtnLoader = true;
    this.timesheetsObj.status = "Approved"
    this.timesheetsObj.dateSubmitted = this.dateFormatedDate(new Date())
    this.service.modifyAndApprove(this.id,this.timesheetsObj).subscribe(d=>{
      if(d.status == 200){
        // this.showLoading = false;
        this.showBtnLoader = false;
        this.message.success(d.message, {
         nzDuration: 3000
       });
       this.router.navigate(['supervisorview'])
      }
      else{
        this.showBtnLoader = false;
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

  getDurationForExtraHours(hrs){
    let time = new Date(this.getFormattedDate(hrs))
    if(!time) return;
    let durationsHours = this.msToTime(time.getTime()); 
    return durationsHours;
  }

  setStartMyDate(event,day,end,dayHrs,extraHrs){
        this.clearField(extraHrs,dayHrs)
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
  setEndMyDate(event,day,start,dayHrs,extraHrs){
    this.clearField(extraHrs,dayHrs)
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

  setExtraHours(event,day,dayHrs){
    // this.hrs[dayHrs] = "00:00"
    this.timesheetsObj[day] = this.getHrsAndMins(event);
    console.log(this.timesheetsObj[day]);
    
    // this.hrs[dayHrs] = this.hrs[dayHrs] + this.getDurationForExtraHours(this.timesheetsObj[day])
    // this.checkAllHrs()
    let hrs = 0, min = 0;
          hrs = (parseInt(this.hrs[dayHrs].split(":")[0])) + (parseInt(this.timesheetsObj[day].split(":")[0]))
          min = (parseInt(this.hrs[dayHrs].split(":")[1])) + (parseInt(this.timesheetsObj[day].split(":")[1]))
          while(min >= 60){
            hrs++;
            min -= 60;
          }
          let hours2 = hrs < 10 ? "0" + hrs : hrs;
          let minutes2 = min < 10 ? "0" + min : min;
          
           this.hrs[dayHrs] = hours2+ ":" +minutes2;
          
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
      this.timesheetsObj.totalHrs = this.totalHrs;
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

 clearField(extraHrs,dayHrs){
   if(this.timesheetsObj[extraHrs] !== "00:00"){
    let hrs = 0, min = 0;
    hrs = (parseInt(this.hrs[dayHrs].split(":")[0])) - (parseInt(this.timesheetsObj[extraHrs].split(":")[0]))
    min = (parseInt(this.hrs[dayHrs].split(":")[1])) - (parseInt(this.timesheetsObj[extraHrs].split(":")[1]))
    
    let hrs2 = hrs < 10 ? "0" + hrs : hrs;
    let min2 = min < 10 ? "0" + min : min;
    this.hrs[dayHrs] = hrs2+ ":" +min2;
    this.timesheetsObj[extraHrs] = "00:00"
   }
   
   
 }

populateTimesheetObjTotalHrs(){
  this.timesheetsObj.monTotalHrs = this.hrs.monHrs;
  this.timesheetsObj.tueTotalHrs = this.hrs.tuesHrs;
  this.timesheetsObj.wedTotalHrs = this.hrs.wedHrs;
  this.timesheetsObj.thursTotalHrs = this.hrs.thursHrs;
  this.timesheetsObj.friTotalHrs = this.hrs.friHrs;
  this.timesheetsObj.satTotalHrs = this.hrs.satHrs;
  this.timesheetsObj.sunTotalHrs = this.hrs.sunHrs;
}
}
