import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { CommonModule, registerLocaleData } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { TestComponent } from './test/test.component';

import { NoopInterceptor } from './request.intercept';
import {MatDialogModule} from '@angular/material/dialog';
import { EmailPopupComponent } from './email-popup/email-popup.component';

import {MatIconModule} from '@angular/material/icon';

import { ViewportfolioComponent } from './viewportfolio/viewportfolio.component';
import {MatDividerModule} from '@angular/material/divider';


import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificationsComponent } from './notifications/notifications.component';
import { ExportAsModule } from 'ngx-export-as';
import { AddCurrentTimesheetsComponent } from './add-current-timesheets/add-current-timesheets.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import en from '@angular/common/locales/en';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ViewCurrentTimesheetsComponent } from './view-current-timesheets/view-current-timesheets.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
registerLocaleData(en);
import { AdduserComponent } from './adduser/adduser.component';
import {MatRadioModule} from '@angular/material/radio';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { SupervisorViewComponent } from './supervisor-view/supervisor-view.component';
import { SupervisorEditComponent } from './supervisor-edit/supervisor-edit.component';
import { RegisterComponent } from './register/register.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { UserTableComponent } from './user-table/user-table.component';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {MenuItem} from 'primeng/api';  
import {CalendarModule} from 'primeng/calendar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PreviousTimesheetsComponent } from './previous-timesheets/previous-timesheets.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NzModalModule } from 'ng-zorro-antd/modal';


// import {MatPaginator} from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';
// import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainScreenComponent,
    TestComponent,
    EmailPopupComponent,
    ViewportfolioComponent,
    NotificationsComponent,
    AddCurrentTimesheetsComponent,
    ViewCurrentTimesheetsComponent,
    AdduserComponent,
    CompanyProfileComponent,
    SupervisorViewComponent,
    SupervisorEditComponent,
    RegisterComponent,
    UserTableComponent,
    PreviousTimesheetsComponent,
    ForgotPasswordComponent,
    NewPasswordComponent
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatBadgeModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatRadioModule,

    MatDialogModule,  

    MatDividerModule,
    NgbModule,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSnackBarModule,
    ExportAsModule,
    NgZorroAntdModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzButtonModule,
    NzMessageModule,
    NzResultModule,
    NzAvatarModule,
    NzBadgeModule ,
    NgxMaterialTimepickerModule,
    AccordionModule,
    CalendarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NzSpinModule,
    NzEmptyModule,
    NzInputModule,
    NzIconModule,
NzAlertModule,
ImageCropperModule,
NzModalModule


    
    // MatGridListModule
  ],
  providers: [
    MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoopInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
