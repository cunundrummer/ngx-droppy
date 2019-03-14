import { Component, OnInit } from '@angular/core';
import { DropperService, IFile } from './dropper/dropper.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'drpr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  numFilesInDropper$: BehaviorSubject<number>;

  constructor(private dropperService: DropperService) {}

  ngOnInit() {
    console.log('App started.');
    console.log('Inspecting files is 0 when started...');
    this.numFilesInDropper$ = this.dropperService.filesCounter$; // assigned reference from dropperService
    console.log(this.numFilesInDropper$.getValue());
  }

  checkIfReceivedFiles(emittedValue: boolean) {
    console.log('Checking child(comp-prompt-view) emitted value: ', emittedValue);
  }
}
