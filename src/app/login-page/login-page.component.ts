import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  errorVisible = false;
  showLoading = false;
  constructor(private router: Router, private service: LoginService,private message: NzMessageService) {}

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
        console.log("this is resp",res)
        if (res.status == 200) {
          this.message.success(res.message, {
            nzDuration: 3000
          });
          this.showLoading = false;
          console.log("toker", res);

          sessionStorage.setItem("userId",res.result.id);
          sessionStorage.setItem("token", res.result.token);
          sessionStorage.setItem("email", res.result.email);
          sessionStorage.setItem("username", res.result.username);
          sessionStorage.setItem("userType", res.result.userType);
          sessionStorage.setItem("userImage",res.result.userImage);
          sessionStorage.setItem(
            "organizationName",
            res.result.organizationName
          );

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
        console.log("error")
        this.message.error(res.message, {
          nzDuration: 3000
        });
      }
        this.showLoading = false;
      }
    );

    // if(output == true){
  }

  routeToRegister() {
    this.router.navigate(["register"]);
  }
}
