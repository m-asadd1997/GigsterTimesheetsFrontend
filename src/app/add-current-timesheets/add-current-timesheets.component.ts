import { Component, OnInit } from "@angular/core";
import { Timesheet } from "./Timesheet";
import { ApplicantServiceService } from "../Services/applicant-service.service";
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: "app-add-current-timesheets",
  templateUrl: "./add-current-timesheets.component.html",
  styleUrls: ["./add-current-timesheets.component.css"]
})



export class AddCurrentTimesheetsComponent implements OnInit {
  time: Date | null = null;
  email: string;
  hello: any;
  organizationName: String;
  currentSupervisor;
  supervisors: any[] = [];
  timesheetsObj: Timesheet = new Timesheet();
  userId:any;
  id: any;
  disableButton: boolean = true;
  showRange:any;
  weekId : any = this.getWeek();
  hideForm: boolean;
  showLoader = false;
  hideSection = false;
  weekIdforView: any;
  showRangeForView: string;
  userImage: string;
  totalHrs = "0";
  totalMins = 0;
  disableInputFields = false;
  totalSumOfTimesheet = {
    hours:0,
    minutes:0
  }
  showButton = true;
  showLoader2 = false;
  showErrorDiv: boolean = false;
  disableSaveButton = false;
  check:any;
  sendId:any;
  showLoader3 = false;
  showEditBtn = true;
  viewTimesheet = true;
  userName: string;

  constructor(private service: ApplicantServiceService,private router:Router,private message: NzMessageService,private activateRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.userImage = sessionStorage.getItem("userImage");
    this.id = this.activateRoute.snapshot.params['id'];
    this.userName = sessionStorage.getItem("userName")

    if(this.id){
      this.hideForm = true;
      this.hideSection = false;
      this.viewTimesheet = false;
      this.getTimesheetById();
      this.disableButton = false;
      this.disableInputFields =  true;
      

    }
    else{
      this.hideSection = true;
      this.checkTimesheet();
    }
    this.getUserLoginInfo();
    this.getRange();
    
    

    
    
  }

  logout(){
    this.service.logout(this.router);
  }

  log(time: Date): void {
    // console.log(time && time.toTimeString());
  }

  getUserLoginInfo() {
    this.email = sessionStorage.getItem("email");
    this.service.getUserByEmail(this.email).subscribe(data => {
      // console.log(data.organizationName)
      this.timesheetsObj.user = data;
      this.userId = data.id;
      
    });
    this.getSupervisorsOfSameOrganization();
    
  }

  saveTimesheets(){
    this.showLoader2 = true;
    this.timesheetsObj.supervisor = null;
    this.timesheetsObj.dateSubmitted = this.dateFormatedDate(new Date());
    this.timesheetsObj.status = "Draft"
    this.timesheetsObj.weekId = this.weekId;
    this.service.saveTimesheets(this.timesheetsObj).subscribe(d=>{
      if(d.status == 200){
        this.showEditBtn = true;
        this.showLoader2 = false;
        this.sendId = d.result.id;
        this.message.success(d.message, {
          nzDuration: 3000
        });
      }
      else{
        this.showLoader2 = false;
          this.message.error(d.message, {
            nzDuration: 3000
          });
       
      }

      
    },error=>{
      this.showLoader2 = false;
          this.message.error(error, {
            nzDuration: 3000
          });
    }
    )
    
  }

  getSupervisorsOfSameOrganization(){
    this.organizationName = sessionStorage.getItem("organizationName");
    this.service.getSupervisors(this.organizationName).subscribe(d=>{
     d.result.map(d=>{
      //  console.log("ander",d)
       this.supervisors.push({
         
         value:d,
         viewValue:d.name
       })
     })
    })
  }

  goToNewTimesheet(){
    this.router.navigate(['addcurrenttimesheets'])
  }

  goToMyTimeSheets(){
    this.router.navigate(['currenttimesheets/'+this.userId])
  }

  getTimesheetById(){
    this.hideForm = true;
    this.showLoader = true;
    this.service.getTimesheetById(this.id).subscribe(d=>{
      this.timesheetsObj = d.result;
      this.weekIdforView = d.result.weekId;
      this.getRangeForView()
      // console.log(parseFloat(d.result.mondayEndTime.s))
     
      if(this.timesheetsObj){
        this.showButton = false;
        this.calulateHours()
        this.showLoader = false;
      }
      else{
        this.showLoader = true;
      }
    })
  }

  getWeek() {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  getRange(){
    this.showRange =  (this.dateFormatedDate(this.getStartingDay(this.weekId,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekId,new Date().getFullYear())))
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

  goToPreviousWeek(){
    this.resetHrs();
    this.emptyTimesheetObj();
    this.showLoader = true;
   this.weekId = this.weekId - 1;
    this.service.getTimesheetByWeekId(this.weekId,this.userId).subscribe(d=>{
      this.checkTimehseetsForWeeks(d)
    })
    this.showRange =  (this.dateFormatedDate(this.getStartingDay(this.weekId,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekId,new Date().getFullYear())))
  }

 goToNextWeek(){
  this.resetHrs();
   this.emptyTimesheetObj();
    this.showLoader = true;
      this.weekId = this.weekId + 1;
      this.service.getTimesheetByWeekId(this.weekId,this.userId).subscribe(d=>{
        this.checkTimehseetsForWeeks(d)
      })
      this.showRange =  (this.dateFormatedDate(this.getStartingDay(this.weekId,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekId,new Date().getFullYear())))
    
  } 

  checkWeek(){
    if(this.weekId === this.getWeek()){
      return true;
    }
    else{
      return false;
    }
  }
  checkTimesheet(){
    this.showLoader = true;
    let id = sessionStorage.getItem("userId")
    this.service.getTimesheetByWeekId(this.weekId,id).subscribe(d=>{
      this.checkTimehseetsForWeeks(d)
    })
  
  }

  checkTimehseetsForWeeks(d){
    if(d.status == 200){
      this.showLoader = false;
      this.sendId = d.result.id;
     if(d.result.sendFlag === "NO"){
      console.log(d.result.sendFlag)
      this.showEditBtn = true;
      this.hideForm = true;
      this.timesheetsObj = d.result;
      this.weekIdforView = d.result.weekId;
      this.getRangeForView()
      // console.log(parseFloat(d.result.mondayEndTime.s))
     
      if(this.timesheetsObj){
        
        this.calulateHours()
        this.showLoader = false;
      }
      else{
        this.showLoader = true;
      }
     }
     else if(d.result.sendFlag === "YES"){
      
      this.showEditBtn = false;
      this.hideForm = false;
     }
      
    }
    else{
      this.showEditBtn = false;
      this.showLoader = false;
      this.hideForm = true;
    }
  }
  
  getRangeForView(){
    this.showRangeForView =  (this.dateFormatedDate(this.getStartingDay(this.weekIdforView,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekIdforView,new Date().getFullYear())))
  }
  
  goToProfiles(){
    this.router.navigate(['applicantForm'])
  }
 
  getFormattedDate(time){
    let date = new Date();
    //" 11:13:00"
     return (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+time);

  }


  getDuration(startTime,event) {
   
    let d1 = new Date(this.getFormattedDate(startTime))
    if(!d1)
    return;

    let d2 = new Date(this.getFormattedDate(event))
   
    let durationsHours = this.msToTime(d2.getTime()-d1.getTime());
        
   
    return durationsHours;
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

getSumOfHours(startTime,event) {
    
  let d1 = new Date(this.getFormattedDate(startTime))
  if(!d1)
  return;

  let d2 = new Date(this.getFormattedDate(event))
 
  this.totalSumOfTimesheet.hours += this.getDurationHours(d1,d2).getHours();
  this.totalSumOfTimesheet.minutes += this.getDurationHours(d1,d2).getMinutes();
  
}

getHours(start,end){
  if(!start || !end){
    return "0"
  }
  else{
   
  return this.getDuration(start,end);
  }
}

getDurationHours(d1, d2) {
  
  let d3 = new Date(d2 - d1);
  let d0 = new Date(0);
  
  
  
  return {
      getHours: function(){
        
          return d3.getHours() - d0.getHours();
      },
      getMinutes: function(){
        
          return d3.getMinutes() - d0.getMinutes();
      },
      getMilliseconds: function() {
          return d3.getMilliseconds() - d0.getMilliseconds();
      },
      toString: function(){
        
        
        
          return this.getHours() + " Hours , " +
                 this.getMinutes() + " Minutes" 
                
      }
      
      
  };
}

  calulateHours(){
    this.resetHrs();
    
    if(!this.validateButton2()){
      this.getSumOfHours(this.timesheetsObj.mondayStartTime,this.timesheetsObj.mondayEndTime)
      this.getSumOfHours(this.timesheetsObj.tuesdayStartTime,this.timesheetsObj.tuesdayEndTime)
      this.getSumOfHours(this.timesheetsObj.wednesdayStartTime,this.timesheetsObj.wednesdayEndTime)
      this.getSumOfHours(this.timesheetsObj.thursdayStartTime,this.timesheetsObj.thursdayEndTime)
      this.getSumOfHours(this.timesheetsObj.fridayStartTime,this.timesheetsObj.fridayEndTime)
      this.getSumOfHours(this.timesheetsObj.saturdayStartTime,this.timesheetsObj.saturdayEndTime)
      this.getSumOfHours(this.timesheetsObj.sundayStartTime,this.timesheetsObj.sundayEndTime)
      while(this.totalSumOfTimesheet.minutes > 60){
        this.totalSumOfTimesheet.hours++;
        this.totalSumOfTimesheet.minutes -= 60;
      }
      this.totalHrs = this.totalSumOfTimesheet.hours + "Hours,"+this.totalSumOfTimesheet.minutes+" Minutes";
    }else{
      this.message.error("Please Fill Complete Timesheet To Calculate Hours", {
        nzDuration: 3000
      });
    }
   
  }

  resetHrs(){
    this.totalSumOfTimesheet.hours = 0;
    this.totalSumOfTimesheet.minutes = 0;
    this.totalHrs = 0 + "Hours,"+ 0 +" Minutes";
  }

 validateButton(){
   if(this.timesheetsObj.mondayStartTime && this.timesheetsObj.mondayEndTime && this.timesheetsObj.tuesdayStartTime && this.timesheetsObj.tuesdayEndTime && this.timesheetsObj.wednesdayStartTime && this.timesheetsObj.wednesdayEndTime &&
      this.timesheetsObj.thursdayStartTime && this.timesheetsObj.tuesdayEndTime &&this.timesheetsObj.fridayStartTime && this.timesheetsObj.fridayEndTime && this.timesheetsObj.saturdayStartTime && this.timesheetsObj.saturdayEndTime &&this.timesheetsObj.sundayStartTime && this.timesheetsObj.sundayEndTime  )
      {
       
        return false
      }
      else{
        
        return true;
      }
 }

 validateButton2(){
  if(this.timesheetsObj.mondayStartTime && this.timesheetsObj.mondayEndTime && this.timesheetsObj.tuesdayStartTime && this.timesheetsObj.tuesdayEndTime && this.timesheetsObj.wednesdayStartTime && this.timesheetsObj.wednesdayEndTime &&
     this.timesheetsObj.thursdayStartTime && this.timesheetsObj.tuesdayEndTime &&this.timesheetsObj.fridayStartTime && this.timesheetsObj.fridayEndTime && this.timesheetsObj.saturdayStartTime && this.timesheetsObj.saturdayEndTime &&this.timesheetsObj.sundayStartTime && this.timesheetsObj.sundayEndTime)
     {
       //console.log(this.timesheetsObj);
      
       return false
     }
     else{
       
       return true;
     }
}

 emptyTimesheetObj(){
   this.timesheetsObj.mondayStartTime = "00:00";
   this.timesheetsObj.mondayEndTime = "00:00";
   this.timesheetsObj.tuesdayStartTime = "00:00";
   this.timesheetsObj.tuesdayEndTime = "00:00";
   this.timesheetsObj.wednesdayStartTime = "00:00";
   this.timesheetsObj.wednesdayEndTime = "00:00";
   this.timesheetsObj.thursdayStartTime = "00:00";
   this.timesheetsObj.thursdayEndTime = "00:00";
   this.timesheetsObj.fridayStartTime = "00:00";
   this.timesheetsObj.fridayEndTime = "00:00";
   this.timesheetsObj.saturdayStartTime = "00:00";
   this.timesheetsObj.saturdayEndTime = "00:00";
   this.timesheetsObj.sundayStartTime = "00:00";
   this.timesheetsObj.sundayEndTime = "00:00";
   this.timesheetsObj.supervisor = "00:00";
 }

 checkNegativeValue(start,end){
   if(start && end){
    if(start > end){
      this.showErrorDiv = true;
      this.disableSaveButton = true;    
    }
    else
    {
      this.showErrorDiv = false;
      this.disableSaveButton = false;
    }
 
   }
   else{
     this.showErrorDiv = false;
   }
 }

sendToSupervisor(){

  this.showLoader3 = true;
  this.timesheetsObj.status = "Pending"
  this.service.sendToSupervisor(this.sendId,this.timesheetsObj).subscribe(d=>{
    if(d.status == 200){
      this.hideForm = false;
      this.showLoader3 = false;      
      this.message.success(d.message, {
        nzDuration: 3000
      });
    }
    else{
      this.showLoader3 = false;
      this.message.error(d.message, {
        nzDuration: 3000
      });
    }
  })
}

validateButton3(){
  if(this.timesheetsObj.supervisor)
     {
      
       return false
     }
     else{
       
       return true;
     }
}

editTimesheet(){
  this.showLoader2 = true;
  this.timesheetsObj.dateSubmitted =this.dateFormatedDate(new Date());
  this.timesheetsObj.status = "Draft";
  this.service.modifyAndApprove(this.sendId,this.timesheetsObj).subscribe(d=>{
    if(d.status == 200){
      this.showLoader2 = false;
      this.message.success(d.message, {
        nzDuration: 3000
      });
    }
    else{
      this.showLoader2 = false;
      this.message.error(d.message, {
        nzDuration: 3000
      });
    }
  })
}
}
