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
  displayedColumns: string[] = ['id', 'status', 'modifiedBy','action'];
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  constructor(private router:Router,private service: ApplicantServiceService,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];
    console.log(this.id)

    if(this.id){
      this.getTimesheets();
    }
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
      this.tableData = d.result;
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
}
