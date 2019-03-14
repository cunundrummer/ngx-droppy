import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DropperService, IFile } from '../dropper/dropper.service';
import Cropper from 'cropperjs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EditedStates, EditorService } from './editor.service';
import { map } from 'rxjs/operators';

export interface IDialogData {
  caption: string;
  iFile: IFile;
  index: number;
  newImageBlob: string | Blob;
}

@Component({
  selector: 'drpr-pic-editor',
  templateUrl: './pic-editor.component.html',
  styleUrls: ['./pic-editor.component.css'],
  providers: [EditorService]
})
export class PicEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imgToBeCropped', {read: ViewContainerRef}) imgEl: ViewContainerRef;
  @ViewChild('captionInput', {read: ElementRef}) captionInput: ElementRef<HTMLInputElement>;
  cropper: Cropper;
  /**
   * @description only for cropBox. To be used as on off switch.
   */
  cropperIsToggled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  blobFromFile: string;
  editedState$: BehaviorSubject<EditedStates> = new BehaviorSubject( EditedStates.UNEDITED);
  editedStateSubs$: Subscription;
  isEdited = false;

  originalFilename: string;

  // todo: show user edited states (for knowing why there is/is not a save button?
  constructor(public dialogRef: MatDialogRef<PicEditorComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: IDialogData,
              private dropperService: DropperService,
              private editService: EditorService,
              private renderer: Renderer2) { }

  ngOnInit() {
    this.dialogRef.updateSize('90vw', '90vh');
    console.log('Received data: ', this.dialogData);
    console.log('Saving original data...');
    this.originalFilename = this.dialogData.iFile.file.name;
    this.storeOriginalData();
    console.log('saved!');
    if (this.editService.getEditedState() !== EditedStates.UNEDITED) {
      this.editService.setEditedState(EditedStates.UNEDITED);
    }
    console.log('inspecting state for init...', this.editService.getEditedState());
    console.log('rendering image...');
    this.renderer.setAttribute(this.imgEl.element.nativeElement, 'src', this.editService.createUrlFromFile(this.dialogData.iFile.file));
    this.editedStateSubs$ = this.editedState$
      .pipe(
        map((state: EditedStates) => {
          console.log('In map pipe, determining result...');
          console.log('current edited state: ', state);
          console.log('Returning: ', state === EditedStates.UNEDITED);
          return state === EditedStates.UNEDITED;
        })
      )
      .subscribe((val: boolean) => {
        console.log('Have val of:' , val);
        this.isEdited = val;
      });
  }

  ngAfterViewInit() {
    console.log('Preparing cropper, look for ready message...');
    this.initCropper();
  }

  storeOriginalData() {
    const savedData: IDialogData = this.dialogData;
    savedData.newImageBlob = this.editService.createUrlFromFile(this.dialogData.iFile.file);
    console.log('Saved data: ', savedData);
  }

  initCropper() {
    this.cropper = new Cropper(this.imgEl.element.nativeElement, {
      aspectRatio: NaN,
      viewMode: 2,
      autoCrop: false,
      autoCropArea: .5,
      zoomOnTouch: false,
      movable: true,
      minContainerWidth: 250,
      minCropBoxWidth: 100,
      minCanvasWidth: 250,
      checkOrientation: false,
      dragMode: 'move' as any, // https://github.com/fengyuanchen/cropperjs/issues/308
      ready: () => {
        console.log('cropper is ready and started...');
        console.log('container data: ', this.cropper.getContainerData());
        console.log('canvas data: ', this.cropper.getCanvasData());
        console.log('image data: ', this.cropper.getImageData());
      },
    });
  }

  cancel() {
    this.editService.setEditedState(EditedStates.CANCELLED);
    this.editedState$.next(this.editService.getEditedState());
    this.dialogRef.close(this.dialogData);
  }

  undo() {
    this.cropper.reset();
    this.editService.setEditedState(EditedStates.UNEDITED);
    this.editedState$.next(this.editService.getEditedState());
  }

  cropBegin() {
    console.log('cropper box loaded.');
    if (!this.cropperIsToggled.getValue()) {
      this.cropper.crop();
      this.cropperIsToggled.next(true);
      return;
    }
    this.cropper.clear(); // removes the crop box
    this.cropperIsToggled.next(false);
  }

  /**
   * @description If the user cropped the image, then it is considered done.
   */
  cropDone() {
    console.log('Cropping image...');
    const canvas = this.cropper.getCroppedCanvas();
    canvas.toBlob((blob: Blob) => {
      console.log('Blob being created...');
      this.blobFromFile = URL.createObjectURL(blob); // will be used as the image src
      // todo: check where to URL.revokeObjectURL(url).  Could lead to a memory leak!!!
      console.log('Replacing old image with new edited image...');
      this.cropper.replace(this.blobFromFile as string);
      console.log('blobFromFile created and assigned.  Attempting to revokeURL...');
      console.log('the cropper box should be off now.');
    });
    console.log('setting edited state to ', EditedStates.CROPPED);
    this.editService.setEditedState(EditedStates.CROPPED);
    this.editedState$.next(this.editService.getEditedState());
  }

  save() {
    console.log('Saving image...');
    this.editService.setEditedState(EditedStates.SAVED);
    this.editedState$.next(this.editService.getEditedState());
    this.dialogData.caption = this.captionInput.nativeElement.value || '';
    if (this.blobFromFile) {
      this.dialogData.newImageBlob = this.blobFromFile;
    }
    this.dialogRef.close(this.dialogData);
  }

  zoomIn() {
    console.log('zooming in...');
    this.cropper.zoom(0.1);
    this.editService.setEditedState(EditedStates.ZOOMED_IN);
    this.editedState$.next(this.editService.getEditedState());
  }

  zoomOut() {
    console.log('zooming out...');
    this.cropper.zoom(-0.1);
    this.editService.setEditedState(EditedStates.ZOOMED_OUT);
    this.editedState$.next(this.editService.getEditedState());
  }

  rotateLeft() {
    console.log('rotating left(-90)...');
    this.cropper.rotate(-90);
    this.editService.setEditedState(EditedStates.ROTATED_LEFT);
    this.editedState$.next(this.editService.getEditedState());
  }

  rotateRight() {
    console.log('rotating right(90)...');
    this.cropper.rotate(90);
    this.editService.setEditedState(EditedStates.ROTATED_RIGHT);
    this.editedState$.next(this.editService.getEditedState());
  }

  ngOnDestroy() {
    if (this.editedStateSubs$) {
      console.log('Destroying subscription of editedState$...');
      this.editedStateSubs$.unsubscribe();
    }
  }
}
