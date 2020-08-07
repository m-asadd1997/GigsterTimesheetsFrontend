import { Component, OnInit } from "@angular/core";
import { Timesheet } from "./Timesheet";
import { ApplicantServiceService } from "../Services/applicant-service.service";
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

@Component({
  selector: "app-add-current-timesheets",
  templateUrl: "./add-current-timesheets.component.html",
  styleUrls: ["./add-current-timesheets.component.css"]
})



export class AddCurrentTimesheetsComponent implements OnInit {
  email: string;
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
  smileySection = true;
  type: string;
  disableExtraHrs = false;

  constructor(private service: ApplicantServiceService,private router:Router,private message: NzMessageService,private activateRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
   

    this.getItemsOnPageLoad();
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

  checkExtraHrsField(dayHrs){

    if(this.hrs[dayHrs] == "00:00" || this.hrs[dayHrs] == "Error") return true
    else return false;
  }

 getItemsOnPageLoad(){
  this.userImage = sessionStorage.getItem("userImage");
  this.id = this.activateRoute.snapshot.params['id'];
  this.userName = sessionStorage.getItem("userName");
  this.type = sessionStorage.getItem("userType").toLowerCase();
  this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);
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
    this.calculateTotalHrs();
    this.populateTimesheetObjTotalHrs()
    
    console.log("these are total hours",this.timesheetsObj.totalHrs);
    
    this.showLoader2 = true;
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
       console.log("ander",d)
       this.supervisors.push({
         
         value:d,
         viewValue:d.name,
         supervisorImage:d.userImage
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
    this.smileySection = !this.showLoader;
    this.service.getTimesheetById(this.id).subscribe(d=>{
      this.timesheetsObj = d.result;
      this.weekIdforView = d.result.weekId;
      this.getRangeForView()
      // console.log(parseFloat(d.result.mondayEndTime.s))
     
      if(this.timesheetsObj){
        this.showButton = false;
        this.populateDuration(d.result);
        this.calculateTotalHrs()
        this.showLoader = false;
        this.smileySection = !this.showLoader;
      }
      else{
        this.showLoader = true;
        this.smileySection = !this.showLoader
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
    this.initializeHrs();
    this.emptyTimesheetObj();
    this.showLoader = true;
    this.smileySection = !this.showLoader
   this.weekId = this.weekId - 1;
    this.service.getTimesheetByWeekId(this.weekId,this.userId).subscribe(d=>{
      this.checkTimehseetsForWeeks(d)
    })
    this.showRange =  (this.dateFormatedDate(this.getStartingDay(this.weekId,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekId,new Date().getFullYear())))
  }

 goToNextWeek(){
  this.resetHrs();
  this.initializeHrs();
   this.emptyTimesheetObj();
    this.showLoader = true;
    this.smileySection = !this.showLoader
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
    this.smileySection = !this.showLoader
    let id = sessionStorage.getItem("userId")
    this.service.getTimesheetByWeekId(this.weekId,id).subscribe(d=>{
      this.checkTimehseetsForWeeks(d)
    })
  
  }

  checkTimehseetsForWeeks(d){
    if(d.status == 200){
      console.log(d.result.id,d.result.sendFlag)
      this.showLoader = false;
      this.smileySection = !this.showLoader
      this.sendId = d.result.id;
     if(d.result.sendFlag === "NO"){
      console.log(d.result.sendFlag,this.sendId)
      this.showEditBtn = true;
      this.hideForm = true;
      this.timesheetsObj = d.result;
      this.populateDuration(d.result)
      this.weekIdforView = d.result.weekId;
      this.getRangeForView()
      // console.log(parseFloat(d.result.mondayEndTime.s))
     
      if(this.timesheetsObj){
        
        this.calculateTotalHrs()
        this.showLoader = false;
        this.smileySection = !this.showLoader
      }
      else{
        this.showLoader = true;
        this.smileySection = !this.showLoader
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
      this.smileySection = !this.showLoader
      this.hideForm = true;
      this.sendId = null;
    }
  }


populateDuration(d){
  Object.keys(d).forEach(d=>{
    
    if(d.includes("monday")){
     this.hrs.monHrs = this.getDuration(this.timesheetsObj.mondayStartTime,this.timesheetsObj.mondayEndTime)
     this.hrs.monHrs = this.calculateHrsAtPageLoad(this.hrs.monHrs,this.timesheetsObj.monExtraHrs);
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

  })
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

msToTime(duration: number) {
         
         let  minutes = Math.floor((duration / (1000 * 60)) % 60);
         let  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);


      
         let hours2 = hours < 10 ? "0" + hours : hours;
         let minutes2 = minutes < 10 ? "0" + minutes : minutes;
         
         return hours2 + ":" + minutes2;
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
       this.checkExtraHrsField(dayHrs)
        
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
        this.checkExtraHrsField(dayHrs)

      }

      setExtraHours(event,day,dayHrs){
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
   this.timesheetsObj.monExtraHrs = "00:00";
   this.timesheetsObj.tueExtraHrs = "00:00";
   this.timesheetsObj.wedExtraHrs = "00:00";
   this.timesheetsObj.thursExtraHrs = "00:00";
   this.timesheetsObj.friExtraHrs = "00:00";
   this.timesheetsObj.satExtraHrs = "00:00";
   this.timesheetsObj.sunExtraHrs = "00:00";

 
 }

sendToSupervisor(){
  this.calculateTotalHrs();
  this.populateTimesheetObjTotalHrs();
  if(this.sendId){
    this.showLoader2 = true;
    this.timesheetsObj.dateSubmitted =this.dateFormatedDate(new Date());
    this.timesheetsObj.status = "Draft";
    this.service.modifyAndApprove(this.sendId,this.timesheetsObj).subscribe(d=>{
      
      if(d.status == 200){
        this.showLoader2 = false;
        this.showLoader3 = true;
       this.timesheetsObj.status = "Pending"
       this.service.sendToSupervisor(this.sendId,this.timesheetsObj).subscribe(d=>{
         console.log(this.timesheetsObj.supervisor + " this is sup")
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
      else{
        this.showLoader2 = false;
        this.message.error(d.message, {
          nzDuration: 3000
        });
      }
    })
  
  }
  else{
    
    this.showLoader2 = true;
    this.timesheetsObj.dateSubmitted = this.dateFormatedDate(new Date());
    this.timesheetsObj.status = "Draft"
    this.timesheetsObj.weekId = this.weekId;
    this.service.saveTimesheets(this.timesheetsObj).subscribe(d=>{
      if(d.status == 200){
       
        this.showLoader2 = false;
        this.sendId = d.result.id;
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
      else{
        this.showLoader2 = false;
          this.message.error(d.message, {
            nzDuration: 3000
          });
       
      }
  
    })
}
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
  this.calculateTotalHrs();
  this.populateTimesheetObjTotalHrs();
  console.log("this is hrs on edit",this.timesheetsObj);
  
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

calculateTotalHrs(){
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

populateTimesheetObjTotalHrs(){
  this.timesheetsObj.monTotalHrs = this.hrs.monHrs;
  this.timesheetsObj.tueTotalHrs = this.hrs.tuesHrs;
  this.timesheetsObj.wedTotalHrs = this.hrs.wedHrs;
  this.timesheetsObj.thursTotalHrs = this.hrs.thursHrs;
  this.timesheetsObj.friTotalHrs = this.hrs.friHrs;
  this.timesheetsObj.satTotalHrs = this.hrs.satHrs;
  this.timesheetsObj.sunTotalHrs = this.hrs.sunHrs;
}

clearField(extraHrs,dayHrs){
  console.log("In clear field");
  
  if(this.timesheetsObj[extraHrs] !== "00:00" && this.hrs[dayHrs] !=="00:00"){
   let hrs = 0, min = 0;
   hrs = (parseInt(this.hrs[dayHrs].split(":")[0])) - (parseInt(this.timesheetsObj[extraHrs].split(":")[0]))
   min = (parseInt(this.hrs[dayHrs].split(":")[1])) - (parseInt(this.timesheetsObj[extraHrs].split(":")[1]))
   
   let hrs2 = hrs < 10 ? "0" + hrs : hrs;
   let min2 = min < 10 ? "0" + min : min;
   this.hrs[dayHrs] = hrs2+ ":" +min2;
   this.timesheetsObj[extraHrs] = "00:00"
  }
}
}
