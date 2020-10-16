import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'Time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit, OnDestroy {
  constructor() {}
  time: string = '';
  interval: any = null;
  ngOnInit(): void {
    this.setTime();
    this.interval = setInterval(() => this.setTime(), 60000);
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  setTime() {
    this.time = new Date()
      .toLocaleString()
      .split(' ')[1]
      .split(':')
      .slice(0, 2)
      .join(':');
  }
}
