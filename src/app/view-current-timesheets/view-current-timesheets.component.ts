import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-current-timesheets',
  templateUrl: './view-current-timesheets.component.html',
  styleUrls: ['./view-current-timesheets.component.css']
})
export class ViewCurrentTimesheetsComponent implements OnInit {


  id : any;
    tableData:any[] = [];
  showLoader = false;
  displayedColumns: string[] = ['id', 'status', 'modifiedBy','week','action'];
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  weekIdforView: any;
  showRangeForView: string;
  userImage: string;
  constructor(private router:Router,private service: ApplicantServiceService,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userImage = sessionStorage.getItem("userImage");
    this.id = this.activateRoute.snapshot.params['id'];
    console.log(this.id)

    if(this.id){
      this.getTimesheets();
    }
  }
  logout(){
    this.service.logout(this.router);
  }
 
  goToNewTimesheet(){
    this.router.navigate(['addcurrenttimesheets'])
  }

  goToMyTimeSheets(){
    this.router.navigate(['currenttimesheets'])
  }

  getTimesheets(){
    this.service.getTimesheetsForUser(this.id).subscribe(d=>{
      console.log(d)

      d.result.map(d=>{
        this.weekIdforView = d.weekId;
        this.getRangeForView();
        this.tableData.push({
          id:d.id,
          status:d.status,
          modifiedBy:d.modifiedBy,
          week:this.showRangeForView

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

  viewTimesheet(id){
    this.router.navigate(['viewtimesheet/'+id]);
  }

  getRangeForView(){
    console.log(this.weekIdforView)
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
}
