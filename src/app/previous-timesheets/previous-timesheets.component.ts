import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-previous-timesheets',
  templateUrl: './previous-timesheets.component.html',
  styleUrls: ['./previous-timesheets.component.css']
})
export class PreviousTimesheetsComponent implements OnInit {
  tableData:any[] = [];
  showLoader = false;
  displayedColumns: string[] = ['id', 'status', 'lastModifiedBy','modifiedAt', 'week','sentBy','action'];
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;

  userImage: string;
  userName: string;
  userType: string;
  supId: string;
  weekIdforView: any;
  showRangeForView: string;
  type: string;

  constructor(private router:Router,private service: ApplicantServiceService) { }

  ngOnInit(): void {
    this.getItemsOnPageLoad();
    this.getTimesheets();
  }
  getItemsOnPageLoad(){
   
    this.userImage = sessionStorage.getItem("userImage");
    this.userName = sessionStorage.getItem("userName")
    this.type = sessionStorage.getItem("userType").toLowerCase();
  this.userType = this.type.charAt(0).toUpperCase()+this.type.slice(1);

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
  logout(){
    this.service.logout(this.router);
  }

  getTimesheets(){
    this.showLoader = true;
    this.tableData = [];
    this.supId = sessionStorage.getItem("userId");
    this.service.getApprovedTimesheets(this.supId).subscribe(d=>{
      
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

  viewTimesheet(id){
    this.router.navigate(['viewapprovedtimesheet/'+id]);
  }
}
