import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input('status') status : any;
  constructor() { }

  ngOnInit(): void {
  }

 returnStatus(){
   if(this.status){
     return true;
   }
   else{
     return false;
   }
 }

}
