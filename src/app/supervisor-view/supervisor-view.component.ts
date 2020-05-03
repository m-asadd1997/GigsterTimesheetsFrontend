import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { concatAll } from 'rxjs/operators';

@Component({
  selector: 'app-supervisor-view',
  templateUrl: './supervisor-view.component.html',
  styleUrls: ['./supervisor-view.component.css']
})
export class SupervisorViewComponent implements OnInit {

  tableData:any[] = [];
  showLoader = false;
  displayedColumns: string[] = ['id', 'status', 'lastModifiedBy','modifiedAt', 'week','sentBy','action'];
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  supId: any;
  weekIdforView: any;
  showRangeForView: string;
  userImage:any;
  userName:string;
  userType: string;
  showEmpty = false;
  type: string;
  constructor(private service: ApplicantServiceService, private message: NzMessageService,private router: Router) { }

  ngOnInit(): void {
    this.getItemsOnPageLoad()
    this.getTimesheets();
   
  }
  
  getItemsOnPageLoad(){
    this.userName = sessionStorage.getItem("userName")
    this.userImage = sessionStorage.getItem("userImage");
    this.type = sessionStorage.getItem("userType").toLowerCase();
  this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);
  }

  logout(){
    this.service.logout(this.router);
  }

  modifyAndApproveTimesheet(id){
    this.router.navigate(['modifytimesheets/'+id])
  }

  getTimesheets(){
    this.showLoader = true;
    this.tableData = [];
    this.supId = sessionStorage.getItem("userId");
    this.service.getTimesheetsForSupervisor(this.supId).subscribe(d=>{
      
      // this.tableData = d.result;
    d.result.map(d=>{
      this.weekIdforView = d.weekId;
      this.getRangeForView();
      this.tableData.push({
        id:d.id,
        status:d.status,
        modifiedBy:d.modifiedBy,
        modifiedAt:d.dateSubmitted,
        sentBy:d.user.name,
        week:this.showRangeForView,
        modifierImage:d.modifiedByImage
      })
    })
    
   

      if(this.tableData)
      {
    
        this.showLoader = false;
        
        
      }
      else{
        
        this.showLoader = false
        
        
      }
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
    })
  }

  approveTimesheet(id){
    this.showLoader = true
    this.service.changeTimesheetStatus(id,"Approved").subscribe(d=>{
      if(d.status == 200){
        
        this.getTimesheets();
        
       // this.showLoading = false;
        this.message.success("Approved Succesfully", {
         nzDuration: 3000
       });
      }
      else{
        // this.showLoading = false;
        this.message.error(d.message, {
          nzDuration: 3000
        });
    }
    this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
  })
}

disapproveTimesheet(id){
  this.showLoader = true
  this.service.changeTimesheetStatus(id,"Disapproved").subscribe(d=>{
    if(d.status == 200){
      
      this.getTimesheets();
      
      
     // this.showLoading = false;
      this.message.success("Disapproved Succesfully", {
       nzDuration: 3000
     });
    }
    else{
      // this.showLoading = false;
      this.message.error(d.message, {
        nzDuration: 3000
      });
  }
  this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
})
}
getRangeForView(){
 
  this.showRangeForView =  (this.dateFormatedDate(this.getStartingDay(this.weekIdforView,new Date().getFullYear())) + " to " + this.dateFormatedDate(this.getEndingDay(this.weekIdforView,new Date().getFullYear())))
}
dateFormatedDate(date){
  return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
}
getStartingDay( weeks, year ) {
  var d = new Date(year, 0, 1);
  var dayNum = d.getDay();
  var requiredDate = --weeks * 7;
  if (((dayNum!=0) || dayNum > 4)) {
      var start = requiredDate;
      requiredDate += 6;
   }
  d.setDate(1 - d.getDay() + ++start );
  return d;
}
getEndingDay( weeks, year ) {
  var d = new Date(year, 0, 1);
  var dayNum = d.getDay();
  var requiredDate = --weeks * 7;
  if (((dayNum!=0) || dayNum > 4)) {
     
      requiredDate += 6;
   }

  d.setDate(1 - d.getDay() + ++requiredDate );
  return d;
}
goToProfiles(){
  this.router.navigate(['applicantForm'])
}

goToPreviousTimesheets(){
  this.router.navigate(['previoustimesheets'])
}
goToCurrentTimesheets(){
  this.router.navigate(['supervisorview'])
}
}
