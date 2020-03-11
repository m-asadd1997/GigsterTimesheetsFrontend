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
  mondayHrs = 0;
  tuesdayHrs = 0;
  wednesdayHrs = 0;
  thursdayHrs = 0;
  fridayHrs= 0;
  saturdayHrs = 0;
  sundayHrs = 0;
  hideSection = false;
  weekIdforView: any;
  showRangeForView: string;
  


  constructor(private service: ApplicantServiceService,private router:Router,private message: NzMessageService,private activateRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
    console.log("current week",this.getWeek());
    this.id = this.activateRoute.snapshot.params['id'];
    if(this.id){
      this.hideForm = true;
      this.hideSection = false;
      this.getTimesheetById();
      this.disableButton = false;

    }
    else{
      this.hideSection = true;
      this.checkTimesheet();
    }
    this.getUserLoginInfo();
    this.getRange();
    
    

    
    
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
      this.mondayHrs = Math.round(Math.abs(Date.parse(d.result.mondayEndTime) - Date.parse(d.result.mondayStartTime)) / 36e5);
      this.tuesdayHrs = Math.round(Math.abs(Date.parse(d.result.tuesdayEndTime) - Date.parse(d.result.tuesdayStartTime)) / 36e5);
      this.wednesdayHrs = Math.round(Math.abs(Date.parse(d.result.wednesdayEndTime) - Date.parse(d.result.wednesdayStartTime)) / 36e5);
      this.thursdayHrs = Math.round(Math.abs(Date.parse(d.result.thursdayEndTime) - Date.parse(d.result.thursdayStartTime)) / 36e5);
      this.fridayHrs = Math.round(Math.abs(Date.parse(d.result.fridayEndTime) - Date.parse(d.result.fridayStartTime)) / 36e5);
      this.saturdayHrs = Math.round(Math.abs(Date.parse(d.result.saturdayEndTime) - Date.parse(d.result.saturdayStartTime)) / 36e5);
      this.sundayHrs = Math.round(Math.abs(Date.parse(d.result.sundayEndTime) - Date.parse(d.result.sundayStartTime)) / 36e5);

      console.log( "this is monday hrs",(this.mondayHrs));
      if(this.timesheetsObj){
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
  
}
