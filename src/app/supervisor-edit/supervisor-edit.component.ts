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
  constructor(private activateRoute: ActivatedRoute,private service: ApplicantServiceService,private message: NzMessageService,private router: Router) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];
    this.getTimeSheetById();
    this.userImage = sessionStorage.getItem("userImage");
  }
  logout(){
    this.service.logout(this.router);
  }

  log(time: Date): void {
    // console.log(time && time.toTimeString());
  }

  getTimeSheetById(){
    this.showLoader = true;
    this.showForm = false;
    this.service.getTimesheetById(this.id).subscribe(d=>{
      this.timesheetsObj = d.result;
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
     
  
      return (this.getDurationHours(d1,d2).toString())
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

  calulateHours(){
    //hours
      
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
    
   
   
  }
  
}
