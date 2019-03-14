import { AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DropperService, IFile } from '../dropper.service';
import { SortablejsOptions } from 'angular-sortablejs';
import { FileHandlerService } from '../../shared/services/file-handler.service';

@Component({
  selector: 'drpr-has-files-view',
  templateUrl: './has-files-view.component.html',
  styleUrls: ['./has-files-view.component.css']
})
export class HasFilesViewComponent implements OnInit, AfterViewInit {
  @Input() numFiles: BehaviorSubject<number>;
  @ViewChild('thumbParent', {read: ViewContainerRef}) thumbParent: ViewContainerRef;
  @ViewChild('thumb', {read: TemplateRef}) thumb: TemplateRef<any>;
  files: IFile[];
  options: SortablejsOptions;

  constructor(private dropperService: DropperService, private fileHandlerService: FileHandlerService) {}
  // todo: implement previewer for all images (as if it was already uploaded). Beside the upload button?Possibly in the form that contains the dropper

  ngOnInit() {
    console.log('View container will show ', this.numFiles.getValue(), ' thumbnails');
    this.files = this.dropperService.files;
    console.log('Original files array...', this.files);
    this.options = {
      onUpdate: this.onUpdate.bind(this)
    };
  }

  ngAfterViewInit() {}

  removeThumbnail(index: number) {
    console.log(`Received message to remove thumbnail/file ${index}`);
    this.dropperService.removeFiles(index);
  }

  onUpdate(event) {
    console.log('sortablejs event: ', event);
  }

  onDragEnter(ev) {
   //  console.log(ev.target);
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
