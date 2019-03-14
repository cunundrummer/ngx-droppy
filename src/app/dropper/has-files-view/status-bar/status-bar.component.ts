import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'drpr-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  upload() {
    console.log('IMPLEMENT UPLOAD HERE!');
  }

  preview() {
    console.log('IMPLEMENT IMGS PREVIEWER HERE!');
  }
}
