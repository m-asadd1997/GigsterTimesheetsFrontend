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
  mondayHrs = 0;
  tuesdayHrs = 0;
  wednesdayHrs = 0;
  thursdayHrs = 0;
  fridayHrs= 0;
  saturdayHrs = 0;
  sundayHrs = 0;
  showRange: string;
  weekId: any;
  constructor(private activateRoute: ActivatedRoute,private service: ApplicantServiceService,private message: NzMessageService,private router: Router) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];
    this.getTimeSheetById();
  }

  log(time: Date): void {
    // console.log(time && time.toTimeString());
  }

  getTimeSheetById(){
    this.service.getTimesheetById(this.id).subscribe(d=>{
      this.timesheetsObj = d.result;
      this.weekId = d.result.weekId;
      console.log(d.result.weekId)
      this.getRange();
      this.mondayHrs = Math.round(Math.abs(Date.parse(d.result.mondayEndTime) - Date.parse(d.result.mondayStartTime)) / 36e5);
      this.tuesdayHrs = Math.round(Math.abs(Date.parse(d.result.tuesdayEndTime) - Date.parse(d.result.tuesdayStartTime)) / 36e5);
      this.wednesdayHrs = Math.round(Math.abs(Date.parse(d.result.wednesdayEndTime) - Date.parse(d.result.wednesdayStartTime)) / 36e5);
      this.thursdayHrs = Math.round(Math.abs(Date.parse(d.result.thursdayEndTime) - Date.parse(d.result.thursdayStartTime)) / 36e5);
      this.fridayHrs = Math.round(Math.abs(Date.parse(d.result.fridayEndTime) - Date.parse(d.result.fridayStartTime)) / 36e5);
      this.saturdayHrs = Math.round(Math.abs(Date.parse(d.result.saturdayEndTime) - Date.parse(d.result.saturdayStartTime)) / 36e5);
      this.sundayHrs = Math.round(Math.abs(Date.parse(d.result.sundayEndTime) - Date.parse(d.result.sundayStartTime)) / 36e5);
    })
    
  }

  modifyAndApprove(){
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
      console.log(this.weekId)
      this.showRange =  (this.dateFormatedDate(this.getStartingDay(this.weekId,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekId,new Date().getFullYear())))
    }

    goToRecievedTimesheets(){
      this.router.navigate(['supervisorview'])
    }
  
}
