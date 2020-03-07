import { Component, OnInit } from "@angular/core";
import { Timesheet } from "./Timesheet";
import { ApplicantServiceService } from "../Services/applicant-service.service";

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
  supervisors: any[] = [
    { value: "yes", viewValue: "Yes" },
    { value: "no", viewValue: "No" }
  ];
  timesheetsObj: Timesheet = new Timesheet();

  constructor(private service: ApplicantServiceService) {}
  
  ngOnInit(): void {
    this.getUserLoginInfo();
    
  }

  log(time: Date): void {
    // console.log(time && time.toTimeString());
  }

  getUserLoginInfo() {
    this.email = sessionStorage.getItem("email");
    this.service.getUserByEmail("emp.com").subscribe(data => {
      console.log(data.organizationName)
      this.timesheetsObj.user = data;
      this.organizationName = data.organizationName;
    });
    this.getSupervisorsOfSameOrganization();
  }

  saveTimesheets(){
    console.log(this.timesheetsObj);
  }

  getSupervisorsOfSameOrganization(){
    this.service.getSupervisors("Stepway").subscribe(d=>{
      console.log(d);
    })
  }

  
}
