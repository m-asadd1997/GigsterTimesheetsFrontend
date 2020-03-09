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

  constructor(private service: ApplicantServiceService,private router:Router,private message: NzMessageService,private activateRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
    console.log("current week",this.getWeek());
    this.id = this.activateRoute.snapshot.params['id'];
    if(this.id){
      this.getTimesheetById();
      this.disableButton = false;

    }
    this.getUserLoginInfo();
    
    
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
    this.service.saveTimesheets(this.timesheetsObj).subscribe(d=>{
      if(d.status == 200){
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
    this.service.getTimesheetById(this.id).subscribe(d=>{
      this.timesheetsObj = d.result;
      console.log("hello",d.result)
    })
  }

  getWeek() {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
  }
  
}
