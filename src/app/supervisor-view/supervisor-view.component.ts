import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor-view',
  templateUrl: './supervisor-view.component.html',
  styleUrls: ['./supervisor-view.component.css']
})
export class SupervisorViewComponent implements OnInit {

  tableData:any[] = [];
  showLoader = false;
  displayedColumns: string[] = ['id', 'status', 'lastModifiedBy', 'sentBy', 'Date','action'];
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  supId: any;
  constructor(private service: ApplicantServiceService, private message: NzMessageService,private router: Router) { }

  ngOnInit(): void {
    this.getTimesheets();
  }

  modifyAndApproveTimesheet(id){
    this.router.navigate(['modifytimesheets/'+id])
  }

  getTimesheets(){
    this.tableData = [];
    this.supId = sessionStorage.getItem("userId");
    this.service.getTimesheetsForSupervisor(this.supId).subscribe(d=>{
      console.log("supervisor Timesheets======>",d)
      // this.tableData = d.result;
    d.result.map(d=>{
      this.tableData.push({
        id:d.id,
        status:d.status,
        modifiedBy:d.modifiedBy,
        sentBy:d.user.name
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
    
    this.service.changeTimesheetStatus(id,"Approved").subscribe(d=>{
      if(d.status == 200){
        let index = this.tableData.findIndex(p => p.id == id);
        this.tableData.splice(index,1)
        console.log("sppppppp",d.result)
        this.showLoader = false;
        
          this.tableData.push({
            id:d.result.id,
            status:d.result.status,
            modifiedBy:d.result.modifiedBy,
            sentBy:d.result.user.name
          })
        
        
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
  
  this.service.changeTimesheetStatus(id,"Disapproved").subscribe(d=>{
    if(d.status == 200){
      let index = this.tableData.findIndex(p => p.id == id);
        this.tableData.splice(index,1)
      console.log("sppppppp",d.result)
      this.showLoader = false;
      
        this.tableData.push({
          id:d.result.id,
          status:d.result.status,
          modifiedBy:d.result.modifiedBy,
          sentBy:d.result.user.name
        })
      
      
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

}
