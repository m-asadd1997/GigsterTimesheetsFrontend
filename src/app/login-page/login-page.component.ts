import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { NzMessageService } from 'ng-zorro-antd';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  errorVisible = false;
  showLoading = false;
  constructor(private compServ : ApplicantServiceService,private router: Router, private service: LoginService,private message: NzMessageService) {}

  ngOnInit(): void {
    localStorage.clear();
  }
  login(email, password) {
    this.errorVisible = false;
    if (email == "stepway" && password == "123") {
      localStorage.setItem("user", "admin");
      this.router.navigate(["applicantForm"]);
    } else {
      this.errorVisible = true;
    }
  }

  check(uname: string, p: string) {
    this.showLoading = true;
    // var output = this.service.checkUserandPass(uname, p);
    this.service.checkUserandPass(uname, p).subscribe(
      res => {
        if (res.status == 200) {
          this.message.success(res.message, {
            nzDuration: 3000
          });
          this.showLoading = false;

          sessionStorage.setItem("userId",res.result.id);
          sessionStorage.setItem("token", res.result.token);
          sessionStorage.setItem("email", res.result.email);
          sessionStorage.setItem("username", res.result.username);
          this.getImageInStorage(res,res.result.organizationName);
          sessionStorage.setItem("userType", res.result.userType);
          sessionStorage.setItem("organizationName",res.result.organizationName);
          sessionStorage.setItem("userName",res.result.username)

          if (res.result.userType === "ADMIN") {

            setTimeout(() => {
              this.router.navigate(["/adduser"]);
            }, 1000);
          }
          else if(res.result.userType == "SUPERVISOR"){
            setTimeout(() => {
              this.router.navigate(["/supervisorview"]);
            }, 1000);
          }
          else if(res.result.userType == "EMPLOYEE"){
            setTimeout(() => {
              this.router.navigate(["/addcurrenttimesheets"]);
            }, 1000);
          }
        }
      else{
        this.message.error(res.message, {
          nzDuration: 3000
        });
      }
        this.showLoading = false;
      },
      error=>{
        this.showLoading = false;
        this.message.error("unauthorized, try again!", {
          nzDuration: 3000
        });
      }
    );

    // if(output == true){
  }

  routeToRegister() {
    this.router.navigate(["register"]);
  }

  getImageInStorage(data,org){
    if(data.result.userType === "ADMIN"){
      this.compServ.getCompanyProfiles(org).subscribe(d=>{
        console.log("Result",d);
        if(d.status == 200){
          sessionStorage.setItem("companyImage", d.result.companyimage);
        }
        else{
          sessionStorage.setItem("companyImage",null);
        }
        
      })
    }
    else{
      sessionStorage.setItem("userImage",data.result.userImage);

    }
  }

  goToForgotPassword(){
    this.router.navigate(['forgotPassword'])
  }
}
