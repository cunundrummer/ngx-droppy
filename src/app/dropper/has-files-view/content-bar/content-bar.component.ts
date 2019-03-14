import { Component, OnInit } from '@angular/core';
import { DropperService } from '../../dropper.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'drpr-content-bar',
  templateUrl: './content-bar.component.html',
  styleUrls: ['./content-bar.component.css']
})
export class ContentBarComponent implements OnInit {
  displayNum: BehaviorSubject<number>;
  constructor(private dropperService: DropperService) { }

  ngOnInit() {
    this.displayNum = this.dropperService.filesCounter$;
  }

  /**
   * @description Builds the string that tells the user how many files are ready to 'handle'
   */
  buildNumFilesString(): string {
    const preString = ' file'; // will add 's' if more than 1 file
    const preStringPlural = preString + 's';
    const numFilesSelectedString = ' selected';
    const numFiles = this.displayNum.getValue();

    if (numFiles > 1) {
      return numFiles.toString() + ' ' + preStringPlural + numFilesSelectedString;
    }
    if (numFiles === 1) {
      return numFiles.toString() + ' ' + preString + numFilesSelectedString;
    }
    if (numFiles === 0) {
      return numFiles.toString() +  preStringPlural + '. Add file(s)';
    }
  }

  /**
   * @description render dropper empty - should remove all files
   */
  cancel() {
    this.displayNum.next(this.dropperService.removeFiles());
    console.log('After cancelling, %d, files are in array.', this.displayNum);
    console.log(`${this.dropperService.files.length} remain in this.files(2nd inspection)`);
  }

  addFiles(ev) {
    console.log(`Received ${ev.target.files.length} files, handlingFiles...`);
    const {goodFiles, restrictedFiles , dropperError} = this.dropperService.performInspections(ev.target.files);
    console.log('After performing inspections, result: ');
    console.log(goodFiles, restrictedFiles, dropperError);
    if (goodFiles !== null && goodFiles.length > 0) {
      this.dropperService.addFiles(goodFiles);
      console.log(`emitting ${goodFiles.length > 0} to parent...`);
      // this.receivedFilesOutput.emit(goodFiles.length > 0);
    }
  }
}
