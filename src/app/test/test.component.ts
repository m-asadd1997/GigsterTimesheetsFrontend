import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  tableData:any[] = [];
  showLoader = true;
  displayedColumns: string[] = ['id', 'name', 'phone', 'address','email','action'];
  //dataSource = new MatTableDataSource<any>(this.tableData);
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  constructor(private applicantService:ApplicantServiceService, private router: Router) { }

  ngOnInit(): void {
    
    this.getDataInTable()
   
    
  }

  getDataInTable(){
  
    //this.tableData = [];
    this.showLoader = true;
    this.applicantService.getApplicantFields().subscribe(data=>{
      console.log(data)
      this.tableData = data; 
      
      if(this.tableData)
      {
        this.showLoader = false;
      }
      else{
        this.showLoader = false
      }
      
    
   
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
    };
     console.log("ye hai data source",this.dataSource)
    })
   
  }

  updateApplicantForm(id:any){
   this.router.navigate(['editapplicantform/'+id])
  }

  deleteApplicantById(id:any){
    this.tableData = [];
    
    this.applicantService.deleteApplicantById(id).subscribe(d=>{

      this.getDataInTable();
    })


  }

  viewPortfolio(id:any){
    this.router.navigate(['viewportfolio/'+id])
  }


  // pageEvent(event){
  //   console.log(event)
  //   let data = this.tableData.slice(0,event);
  //   this.dataSource = new MatTableDataSource(data);
    
  // }

  goToapplicantTable(){
    this.router.navigate(['test'])
  }

  goToNewProfiles(){
    this.router.navigate(['applicantForm'])
  }
  logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');

    this.router.navigate(['']);
 }

 applyFilter(filterValue: string) {
 
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
 
  this.dataSource.filter = filterValue;

 
 }
}
