import { Component, OnInit } from '@angular/core';
import { DropperService } from './dropper/dropper.service';
import { BehaviorSubject } from 'rxjs';
import { FileHandlerService } from './shared/services/file-handler.service';

@Component({
  selector: 'drpr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  numFilesInDropper$: BehaviorSubject<number>;

  constructor(private dropperService: DropperService, private fileHandlerService: FileHandlerService) {}

  ngOnInit() {
    console.log('App started.');
    console.log('Inspecting files is 0 when started...');
    this.numFilesInDropper$ = this.dropperService.filesCounter$; // assigned reference from dropperService
    console.log(this.numFilesInDropper$.getValue());
  }

  checkIfReceivedFiles(emittedValue: boolean) {
    console.log('Checking child(comp-prompt-view) emitted value: ', emittedValue);
  }

  /**
   * @description throw an event of type 'change' after inspecting that files pass their tests
   *            (in dropper service)
   * @param ev: change event
   */
  handleFilesAdded(ev) {
    console.log('ev.type: ', ev.type);
    console.log(`Received ${ev.target.files.length} files from user selection prompt, inspecting files...`);
    // this.receivedFilesOutput.emit(this.fileHandlerService.inspectFiles(ev.target.files));
  }

  /**
   * @description Very likely called from directive event emitter
   * @param ev: should be change event
   */
  transferFilesFromDragAndDrop(ev: Event) {
    if (ev.type === 'change') {
      console.log('Received ', ev.type, ' event from directive');
    }
  }

  /**
   * @description Very likely called from directive event emitter
   * @param files: should be (emitted event) from drag and drop directive
   */
  addFilesFromDragAndDrop(files: File[]) {
    console.log('Received ', files.length, ' from dragging and dropping, inspecting files...');
    this.fileHandlerService.inspectFiles(files);
  }
}
