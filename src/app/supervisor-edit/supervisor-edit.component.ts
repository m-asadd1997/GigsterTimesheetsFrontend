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

}
