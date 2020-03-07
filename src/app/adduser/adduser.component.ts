import { Component, OnInit } from '@angular/core';
import { adduser } from './adduser';
import { NgForm } from '@angular/forms';
import { ApplicantServiceService } from '../Services/applicant-service.service';



@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {

  disableSaveButton: boolean = false;
  hide = true;

  adduserobj: adduser= new adduser();

  constructor(private applicantService:ApplicantServiceService) { }

  ngOnInit() {
  }

  submit(myForm:NgForm){

    console.log(this.adduserobj);

    this.applicantService.saveUserForm(this.adduserobj).subscribe(d=>{
      console.log(d);
      myForm.reset();
    })

  }

}

