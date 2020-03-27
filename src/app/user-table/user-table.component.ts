import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  tableData = [];
  showLoader = true;
  displayedColumns: string[] = ['id', 'name', 'email', 'userType' ,'action'];
  //dataSource = new MatTableDataSource<any>(this.tableData);
  dataSource: MatTableDataSource<any>;
  //@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  userImage: string;
  
  constructor(private service: ApplicantServiceService,private router: Router,private message: NzMessageService) { }

  ngOnInit(): void {
    
    this.userImage = sessionStorage.getItem("companyImage");

    this.getUsersInTable();
  }

  getUsersInTable(){

    this.showLoader = true;
    let organizationName = sessionStorage.getItem("organizationName")
    this.service.getUsersByOrganizationName(organizationName).subscribe(d=>{
      
      if(d.status==200){
        this.showLoader = false;
        this.tableData = d.result;
      }
      else{
        this.showLoader = false;
      }
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
    })
  }

  logout(){
    this.service.logout(this.router);
  }
  goToProfiles(){
    this.router.navigate(['applicantForm'])
  }
  goToOrganizationConfig(){
    this.router.navigate(['companyprofile'])
  }

  goToAddNewUser(){
    this.router.navigate(['adduser'])
  }
  goToUserTable(){
    this.router.navigate(['viewusers'])
  }
  editUser(id){
    this.router.navigate(['edituser/'+id])
  }


  deleteUserById(id){
    this.tableData = [];
    this.service.deleteusers(id).subscribe(d=>{
      if(d.status == 200){
        this.getUsersInTable();
        this.message.success(d.message, {
          nzDuration: 3000
        });
      }
      else{
        this.message.error(d.message, {
          nzDuration: 3000
        });
      }
    })
  }


}
