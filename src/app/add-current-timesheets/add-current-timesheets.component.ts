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
  


  constructor(private service: ApplicantServiceService,private router:Router,private message: NzMessageService,private activateRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.userImage = sessionStorage.getItem("userImage");
    console.log("current week",this.getWeek());
    this.id = this.activateRoute.snapshot.params['id'];
    if(this.id){
      this.hideForm = true;
      this.hideSection = false;
      
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
    // this.timesheetsObj.status = "Pending"
    this.timesheetsObj.weekId = this.weekId;
    this.service.saveTimesheets(this.timesheetsObj).subscribe(d=>{
      if(d.status == 200){
        this.hideForm = false;
        this.message.success(d.message, {
          nzDuration: 3000
        });
      }
      else{
        
          this.message.error(d.message, {
            nzDuration: 3000
          });
       
      }
    })
    console.log(this.timesheetsObj);
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
      console.log("hello",d.result)
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
    this.emptyTimesheetObj();
    this.showLoader = true;
   this.weekId = this.weekId - 1;
    this.service.getTimesheetByWeekId(this.weekId,this.userId).subscribe(d=>{
      console.log("onprevious",d);
      if(d.status == 200){
        this.showLoader = false;
        this.hideForm = false;
      }
      else{
        this.showLoader = false;
        this.hideForm = true;
      }
    })
    this.showRange =  (this.dateFormatedDate(this.getStartingDay(this.weekId,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekId,new Date().getFullYear())))
  }

 goToNextWeek(){
   this.emptyTimesheetObj();
    this.showLoader = true;
      this.weekId = this.weekId + 1;
      this.service.getTimesheetByWeekId(this.weekId,this.userId).subscribe(d=>{
        console.log("onnext",d);
        if(d.status == 200){
          this.showLoader = false;
          this.hideForm = false;
        }
        else{
          this.showLoader = false;
          this.hideForm = true;
        }
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
    let id = sessionStorage.getItem("userId")
    this.service.getTimesheetByWeekId(this.weekId,id).subscribe(d=>{
      console.log("onnext",d);
      if(d.status == 200){
       
        this.hideForm = false;
      }
      else{
       
        this.hideForm = true;
      }
    })
    console.log(this.hideForm)
  }
  
  getRangeForView(){
    console.log(this.weekIdforView)
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
   
    let durationsHours = this.getDurationHours(d1,d2).toString();
        
   
    return durationsHours;
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
    //hours
    if(!this.validateButton()){
      this.getSumOfHours(this.timesheetsObj.mondayStartTime,this.timesheetsObj.mondayEndTime)
      this.getSumOfHours(this.timesheetsObj.tuesdayStartTime,this.timesheetsObj.tuesdayEndTime)
      this.getSumOfHours(this.timesheetsObj.wednesdayStartTime,this.timesheetsObj.wednesdayEndTime)
      this.getSumOfHours(this.timesheetsObj.thursdayStartTime,this.timesheetsObj.thursdayEndTime)
      this.getSumOfHours(this.timesheetsObj.fridayStartTime,this.timesheetsObj.fridayEndTime)
      this.getSumOfHours(this.timesheetsObj.saturdayStartTime,this.timesheetsObj.saturdayEndTime)
      this.getSumOfHours(this.timesheetsObj.sundayStartTime,this.timesheetsObj.sundayEndTime)
      console.log(this.totalSumOfTimesheet);
      this.totalHrs = this.totalSumOfTimesheet.hours + "Hours,"+this.totalSumOfTimesheet.minutes+" Minutes";
    }else{
      this.message.error("Please Fill Complete Timesheet To Calculate Hours", {
        nzDuration: 3000
      });
    }
   
    console.log(this.totalSumOfTimesheet)
  }

 validateButton(){
   if(this.timesheetsObj.mondayStartTime && this.timesheetsObj.mondayEndTime && this.timesheetsObj.tuesdayStartTime && this.timesheetsObj.tuesdayEndTime && this.timesheetsObj.wednesdayStartTime && this.timesheetsObj.wednesdayEndTime &&
      this.timesheetsObj.thursdayStartTime && this.timesheetsObj.tuesdayEndTime &&this.timesheetsObj.fridayStartTime && this.timesheetsObj.fridayEndTime && this.timesheetsObj.saturdayStartTime && this.timesheetsObj.saturdayEndTime &&this.timesheetsObj.sundayStartTime && this.timesheetsObj.sundayEndTime && this.timesheetsObj.supervisor )
      {
        //console.log(this.timesheetsObj);
       
        return false
      }
      else{
        
        return true;
      }
 }

 emptyTimesheetObj(){
   this.timesheetsObj.mondayStartTime = null;
   this.timesheetsObj.mondayEndTime = null;
   this.timesheetsObj.tuesdayStartTime = null;
   this.timesheetsObj.tuesdayEndTime = null;
   this.timesheetsObj.wednesdayStartTime = null;
   this.timesheetsObj.wednesdayEndTime = null;
   this.timesheetsObj.thursdayStartTime = null;
   this.timesheetsObj.thursdayEndTime = null;
   this.timesheetsObj.fridayStartTime = null;
   this.timesheetsObj.fridayEndTime = null;
   this.timesheetsObj.saturdayStartTime = null;
   this.timesheetsObj.saturdayEndTime = null;
   this.timesheetsObj.sundayStartTime = null;
   this.timesheetsObj.sundayEndTime = null;
   this.timesheetsObj.supervisor = null;
 }
}
