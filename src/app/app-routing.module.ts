import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ApplicantTableComponent } from './applicant-table/applicant-table.component';
import { TestComponent } from './test/test.component';
import { ViewportfolioComponent } from './viewportfolio/viewportfolio.component';
import { AddCurrentTimesheetsComponent } from './add-current-timesheets/add-current-timesheets.component';
import { ViewCurrentTimesheetsComponent } from './view-current-timesheets/view-current-timesheets.component';


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
    path:"currenttimesheets",component:ViewCurrentTimesheetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
