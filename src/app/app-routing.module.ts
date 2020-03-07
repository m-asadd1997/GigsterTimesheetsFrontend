import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ApplicantTableComponent } from './applicant-table/applicant-table.component';
import { TestComponent } from './test/test.component';
import { ViewportfolioComponent } from './viewportfolio/viewportfolio.component';
import { AdduserComponent} from './adduser/adduser.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';


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
    path:"editapplicantform/:id",component:MainScreenComponent
  },
  {
    path:"viewportfolio/:id",component:ViewportfolioComponent
  },
  {
    path:"adduser",component:AdduserComponent
  },
  {
    path:"companyprofile", component:CompanyProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
