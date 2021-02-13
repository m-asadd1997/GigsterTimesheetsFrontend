import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(value)
      return value == "00:00" ? "00:00" : this.checkZeros(value);
  }

  checkZeros(time: String){
    let splittedTime = time.split(":",2);
    for(let i = 0; i < splittedTime.length;i++){
      if(splittedTime[i].length == 1)
          splittedTime[i] = "0" + splittedTime[i];
    }
    return splittedTime[0] + ":" + splittedTime[1];
  }

}
