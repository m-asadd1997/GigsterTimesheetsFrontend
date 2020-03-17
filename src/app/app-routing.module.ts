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


const routes: Routes = [
  {
    path:'',component: LoginPageComponent
  },
  {
    path:'applicantForm', component: MainScreenComponent
  },
  {
    path:'applicanttable',component:ApplicantTableComponent
  },
  {
    path:"browseProfiles",component:TestComponent
  },
  {

    path:"editapplicantform/:id",component:MainScreenComponent},

    {path:"viewportfolio/:id",component:ViewportfolioComponent
  },
  {
    path:"addcurrenttimesheets",component:AddCurrentTimesheetsComponent
  },{
    path:"viewtimesheet/:id",component:AddCurrentTimesheetsComponent
  },{
    path:"modifytimesheets/:id",component:SupervisorEditComponent
  }
  ,{
    path:"currenttimesheets/:id",component:ViewCurrentTimesheetsComponent
  },
  {
    path:"adduser",component:AdduserComponent
  },
  {
    path:"companyprofile", component:CompanyProfileComponent

  },
  {
    path:"supervisorview",component:SupervisorViewComponent
  },
  {
    path:"supervisoredit",component:SupervisorEditComponent

  },{
    path:"register",component:RegisterComponent
  },
  {
    path:"viewusers",component:UserTableComponent
  },
  {
    path:"edituser/:id",component:AdduserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
