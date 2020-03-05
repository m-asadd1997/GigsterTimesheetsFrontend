import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-applicant-table',
  templateUrl: './applicant-table.component.html',
  styleUrls: ['./applicant-table.component.css']
})
export class ApplicantTableComponent implements OnInit {

  tableData = [];
  array:any = [{id: 1,
    name: "asad",
    email: "asad.com",
    phone: "12341232",
    address: "stepway",
    gender: "male",
    placeOfBirth: "Karachi",
    dateOfBirth: "Tue Feb 25 2020 05:24:11 GMT+0500 (Pakistan Standard Time)",
    visaDetails: "hello",
    citizenship: "yes",
    employeeApplication: true,
    employeeOrientation: false,
    employeeIdentification: true,
    securityClearance: false,
    medicalClearance: true,
    employeeWellness: false,
    emergencyContact: true}];
  constructor(private applicantService: ApplicantServiceService) { }

  ngOnInit(): void {
    this.getDataInTable()
  }

  getDataInTable(){
    //this.tableData = [];
    this.applicantService.getApplicantFields().subscribe(data=>{
      console.log(data)
      this.tableData = data; 
    //  data.map(d=>{
    //    this.tableData.push({
    //      id:d.id,
    //      name:d.name,
    //      email:d.email,
    //      address:d.address,
    //      phone:d.phone,
    //      gender:d.gender,
    //      placeOfBirth:d.placeOfBirth,
    //      dateOfBirth:d.dateOfBirth,
    //      visaDetails:d.visaDetails,
    //      citizenship:d.citizenship,
    //      employeeApplication:d.employeeApplication,
    //      employeeOrientation:d.employeeOrientation,
    //      employeeIdentification:d.employeeIdentification,
    //      securityClearance:d.securityClearance,
    //      medicalClearance:d.medicalClearance,
    //      employeeWellness:d.employeeWellness,
    //      emergencyContact:d.emergencyContact
    //    })
    //  })
     console.log(this.tableData)
    })
  }

}
