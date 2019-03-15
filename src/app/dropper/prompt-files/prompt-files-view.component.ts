import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FileHandlerService } from '../../shared/services/file-handler.service';

@Component({
  selector: 'drpr-prompt-files',
  templateUrl: './prompt-files-view.component.html',
  styleUrls: ['./prompt-files-view.component.css']
})
export class PromptFilesViewComponent implements OnInit {
  @ViewChild('fileInput', {read: ElementRef}) fileInput: ElementRef<HTMLInputElement>;
  @Output() receivedFilesOutput: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private fileHandlerService: FileHandlerService) { }

  ngOnInit() {
  }

  /**
   * @description throw an event of type 'change' after inspecting that files pass their tests
   *            (in dropper service)
   * @param ev: change event
   */
  handleFilesAdded(ev) {
    console.log('ev.type: ', ev.type);
    console.log(`Received ${ev.target.files.length} files from user selection prompt, inspecting files...`);
    this.receivedFilesOutput.emit(this.fileHandlerService.inspectFiles(ev.target.files));
  }
}
