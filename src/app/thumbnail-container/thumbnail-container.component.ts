import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IFile } from '../dropper/dropper.service';
import { IThumbnail, ThumbnailService } from './thumbnail.service';
import { FileReaderService } from '../shared/services/file-reader.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { IDialogData, PicEditorComponent } from '../pic-editor/pic-editor.component';

@Component({
  selector: 'drpr-thumbnail-container',
  templateUrl: './thumbnail-container.component.html',
  styleUrls: ['./thumbnail-container.component.css'],
  providers: [FileReaderService]
})
export class ThumbnailContainerComponent implements OnInit, OnDestroy {
  @Input() iFile: IFile;
  @Input() fileIndex: number;
  @Output() deleteEmitter: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('img', {read: ElementRef}) img: ElementRef<HTMLImageElement>;
  thumbnailFromFile: IThumbnail;
  readerProgress$: BehaviorSubject<number> = this.readerService.readerProgress$;
  readerResult: BehaviorSubject<string> = new BehaviorSubject<string>('');
  readerProgressSubscription: Subscription;
  dialogRef: MatDialogRef<any>;
  dialogRefSubscription: Subscription;

  constructor(
    private thumbService: ThumbnailService,
    private readerService: FileReaderService,
    private editDialog: MatDialog) { }

  ngOnInit() {
    console.log('Received ', this.iFile.file.name, ' from parent');
    console.log('with index: ', this.fileIndex);
    console.log('converting to IThumbnail...');
    this.thumbnailFromFile = this.thumbService.convertIFileToThumbnail(this.iFile);
    if (!this.thumbnailFromFile) {
      console.log('error converting to thumbnail...');
    }
    console.log('conversion completed, ready to display thumbnail...');
    this.readerService.read(this.thumbnailFromFile.forIFile.file);
    this.readerProgressSubscription = this.readerProgress$.asObservable().subscribe((val: number) => {
      if (val === 100) {
        this.readerResult.next(this.readerService.getResult() as string);
      }
    });
  }

  edit() {
    this.openCropperDialog();
  }

  openCropperDialog() {
    this.dialogRef = this.editDialog.open(PicEditorComponent, {
      width: '250px',
      data: {
        caption: '',
        iFile: this.iFile,
        index: this.fileIndex
      }
    });

    this.dialogRefSubscription = this.dialogRef.afterClosed().subscribe((result: IDialogData) => {
      console.log('After dialog (cropper modal) closed, the result is: ', result);
      this.img.nativeElement.src = result.newImageBlob as string;
    });
  }

  deleteImg() {
    console.log('%cDELETING...', 'background: #222; color: #bada55');
    console.log(`imageIndex[${this.fileIndex}] : ${this.iFile.file.name}`);
    this.deleteEmitter.emit(this.fileIndex);
  }

  ngOnDestroy() {
    console.log(`Thumbnail with index: ${this.fileIndex} getting destroyed...`);
    if (this.readerProgressSubscription) {
      console.log('unsubscribing readerProgress$...');
      this.readerProgressSubscription.unsubscribe();
    }
    if (this.dialogRefSubscription) {
      console.log('unsubscribing dialogRef...');
      this.dialogRefSubscription.unsubscribe();
    }
    console.log(`Thumbnail with index: ${this.fileIndex} destroyed!`);
  }
}
