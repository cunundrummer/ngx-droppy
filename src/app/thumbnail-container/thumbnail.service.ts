import { Injectable } from '@angular/core';
import { IFile } from '../dropper/dropper.service';

export enum ThumbnailStates {
  TOUCHED,
  UNTOUCHED,
  UNEDITED,
  EDITED
}

export interface IThumbnailState {
  state: ThumbnailStates;
  reason?: string;
}

export interface IThumbnailsDescription {
  sizeInReadableFormat: string;
  truncatedName?: string;
}

export interface IThumbnail {
  forIFile: IFile;
  state: IThumbnailState;
  description: IThumbnailsDescription;
}

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {
  readonly MAX_TEXT_LENGTH = 20;

  constructor() { }

  convertIFileToThumbnail(iFile: IFile): IThumbnail {
    const clone = iFile;
    const readableSize = this.returnFileSize(clone.file.size);
    const objDescr = {
      sizeInReadableFormat: readableSize,
      truncatedName: this.truncateText(clone.file.name)
    };

    if (!clone.hasOwnProperty('description')) {
      return {
        forIFile: clone,
        description: objDescr,
        state: {state: ThumbnailStates.UNTOUCHED}
      } as IThumbnail;
    }
  }

  /**
   * @description insures text fits in container
   * @param text: text to truncate (ex. filename_more_letters = 'file...letters')
   * @return string
   */
  truncateText(text?: string): string {
    const ellipse = '...';
    const HALF_LENGTH = this.MAX_TEXT_LENGTH / 2;
    if (text.length > this.MAX_TEXT_LENGTH) {
      return [text.slice(0, HALF_LENGTH), ellipse, text.slice(text.length - HALF_LENGTH - ellipse.length)].join('');
    }
    return text;
  }

  /****************************************
   *      FILE UTILITY FUNCTIONS
   ****************************************/

  /**
   * @description gets file in human readable form/ quantified units
   * @param number: file size
   */
  returnFileSize(num: number): string {
    if (num < 1024) {
      return num + 'bytes';
    } else if (num >= 1024 && num < 1048576) {
      return (num / 1024).toFixed(1) + ' KB';
    } else if (num >= 1048576) {
      return (num / 1048576).toFixed(1) + ' MB';
    }
  }
}
