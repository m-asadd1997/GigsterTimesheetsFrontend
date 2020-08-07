import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ApplicantTableComponent } from './applicant-table/applicant-table.component';
import { TestComponent } from './test/test.component';
import { ViewportfolioComponent } from './viewportfolio/viewportfolio.component';
import { AddCurrentTimesheetsComponent } from './add-current-timesheets/add-current-timesheets.component';
import { ViewCurrentTimesheetsComponent } from './view-current-timesheets/view-current-timesheets.component';
import { AdduserComponent} from './adduser/adduser.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { SupervisorViewComponent } from './supervisor-view/supervisor-view.component';
import { SupervisorEditComponent } from './supervisor-edit/supervisor-edit.component';
import { RegisterComponent } from './register/register.component';
import { UserTableComponent } from './user-table/user-table.component';
import { AuthGuard } from './auth.guard';
import { PreviousTimesheetsComponent } from './previous-timesheets/previous-timesheets.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';


const routes: Routes = [
  {
    path:'',component: LoginPageComponent
  },
  {
    path:'applicantForm', component: MainScreenComponent,canActivate:[AuthGuard],data:{"EMPLOYEE":true, "ADMIN":true,"SUPERVISOR":true}
  },
  {
    path:'applicanttable',component:ApplicantTableComponent
  },
  {
    path:"browseProfiles",component:TestComponent
  },
  {

    path:"editapplicantform/:id",component:MainScreenComponent,canActivate:[AuthGuard],data:{"EMPLOYEE":true, "ADMIN":true,"SUPERVISOR":true}
  },

    {path:"viewportfolio/:id",component:ViewportfolioComponent
  },
  {
    path:"addcurrenttimesheets",component:AddCurrentTimesheetsComponent,canActivate:[AuthGuard],data:{"EMPLOYEE":true}
  },{
    path:"viewtimesheet/:id",component:AddCurrentTimesheetsComponent,canActivate:[AuthGuard],data:{"EMPLOYEE":true}
  },{
    path:"modifytimesheets/:id",component:SupervisorEditComponent,canActivate:[AuthGuard],data:{"SUPERVISOR":true}
  }
  ,{
    path:"currenttimesheets/:id",component:ViewCurrentTimesheetsComponent,canActivate:[AuthGuard],data:{"EMPLOYEE":true}
  },
  {
    path:"viewapprovedtimesheet/:routeId",component:SupervisorEditComponent,canActivate:[AuthGuard],data:{"SUPERVISOR":true}
  },

  {
    path:"adduser",component:AdduserComponent,canActivate:[AuthGuard],data:{"ADMIN":true}
  },
  {
    path:"companyprofile", component:CompanyProfileComponent,canActivate:[AuthGuard],data:{"ADMIN":true}

  },
  {
    path:"supervisorview",component:SupervisorViewComponent,canActivate:[AuthGuard],data:{"SUPERVISOR":true}
  },
  {
    path:"supervisoredit",component:SupervisorEditComponent,canActivate:[AuthGuard],data:{"SUPERVISOR":true}

  },{
    path:"register",component:RegisterComponent
  },
  {
    path:"viewusers",component:UserTableComponent,canActivate:[AuthGuard],data:{"ADMIN":true}
  },
  {
    path:"edituser/:id",component:AdduserComponent,canActivate:[AuthGuard],data:{"ADMIN":true}
  },
  {
    path:"previoustimesheets",component:PreviousTimesheetsComponent,canActivate:[AuthGuard],data:{"SUPERVISOR":true}
  },
  {
    path:"forgotPassword",component:ForgotPasswordComponent
  },
  {
    path:"resetlink/:token",component:NewPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
