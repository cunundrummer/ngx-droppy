import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {
  fileReader: FileReader;
  readerProgress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
    if (!this.fileReader) {
      this.setFileReader();
    }
    this.fileReader.onloadstart = this.onloadstart.bind(this);
    this.fileReader.onload = this.onload.bind(this);
    this.fileReader.onloadend = this.onloadend.bind(this);
    this.fileReader.onprogress = this.onprogress.bind(this);
    this.fileReader.onerror = this.onerror.bind(this);
    this.fileReader.onabort = this.onabort.bind(this);
  }

  setFileReader(reader?: FileReader) {
    if (!reader) {
      this.fileReader = new FileReader();
      return;
    }
    this.fileReader = reader;
  }

  read(fileBlob: File | Blob) {
    if (!this.fileReader) {
      this.setFileReader();
    }
    console.log('********');
    this.fileReader.readAsDataURL(fileBlob);
  }

  getResult(): string | ArrayBuffer {
    return this.fileReader.result;
  }

  onloadstart(ev: ProgressEvent) {
    console.log('reader starting...');
  }

  onload(ev: ProgressEvent) {
    console.log('reader loaded...');
  }

  onloadend(ev: ProgressEvent) {
    console.log('reader ended.');
  }

  onprogress(ev: ProgressEvent) {
    console.log('reader progressing...');
    if (ev.lengthComputable) {
      const percentage = Math.round((ev.loaded * 100) / ev.total);
      console.log(percentage);
      this.readerProgress$.next(percentage);
    }
  }

  onerror(ev: ProgressEvent) {
    console.log('reader error!');
  }

  onabort(ev: ProgressEvent) {
    console.log('Aborting...');
  }
}
