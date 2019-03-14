import { AfterViewInit, Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[drprDropzone]'
})
export class DropzoneDirective implements OnInit, AfterViewInit {
  @Output() dropZoneTransferFilesFromDragAndDrop = new EventEmitter<Event>(); // should be input change event
  @Output() dropZoneFilesToTransfer = new EventEmitter<File[]>(); // should be input change event
  inputEl: HTMLInputElement;
  imgEl: ElementRef<HTMLImageElement>;
  files: File[];

  constructor(private elRef: ElementRef,
              private renderer: Renderer2) {
    console.log('Drag and drop directive has been called on ', elRef.nativeElement);
  }

  ngOnInit() {
    console.log('<-- DragAndDropDirective OnInit -->');
  }

  ngAfterViewInit() {
    console.log('<-- DragAndDropDirective AfterViewInit -->');
    this.renderer.listen(this.elRef.nativeElement, 'dragenter', this.onDragEnter);
    this.renderer.listen(this.elRef.nativeElement, 'dragover', this.onDragOver);
    this.renderer.listen(this.elRef.nativeElement, 'drop', this.onDragDrop.bind(this));
    this.inputEl = this.renderer.createElement('input');
    if (this.inputEl) {
      this.renderer.setAttribute(this.inputEl, 'type', 'file');
      this.renderer.listen(this.inputEl, 'change', (ev) => {
        console.log('change event called in directive');
        console.log('ev', ev);
        this.dropZoneTransferFilesFromDragAndDrop.emit(new Event('change'));
        this.dropZoneFilesToTransfer.emit(this.files);
      });
      console.log('Input element has been created...', this.inputEl);
    }
  }

  onDragEnter(ev: DragEvent) {
    // console.log('on drag enter event fired.');
    console.log(ev);
    ev.preventDefault();
  }

  onDragOver(ev: DragEvent) {
    // console.log('dragging over...');
    console.log('dragging over ev.type: ', ev.type);
    ev.preventDefault();
  }

  onDragDrop(ev: DragEvent) {
    console.log('dropped...');
    console.log(ev);
    console.log('ev.type (should be drop): ', ev.type);
    ev.preventDefault();
    this.files = Array.from(ev.dataTransfer.files) as File[];
    if (this.files && this.files.length > 0) {
      console.log('Received ', this.files.length, ' files.');
      for (const file of this.files) {
        console.log(file.name, ' ready to be processed...');
      }
    }
    if (this.inputEl) {
      console.log('inputEl exists.');
      this.inputEl.files = ev.dataTransfer.files;
    }
  }

  /**
   * @description outputs dragged image to current elements(reference) background image. Was initially used as a test
   *          for dropzone capability
   * @param imgSrc: string -> from filereader result or compatible string type.
   */
  createImg(imgSrc: string) {
    console.log('creating image element...');
    this.imgEl = this.renderer.createElement('img');
    this.renderer.setAttribute(this.imgEl, 'src', imgSrc);
    this.renderer.setAttribute(this.inputEl, 'style', 'visibility: hidden');
    this.renderer.setAttribute(this.elRef.nativeElement, 'style', `background-image: url(${imgSrc})`);
  }

}
