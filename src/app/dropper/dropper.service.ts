import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IFile {
  id?: string;
  file: File;
  error?: IFileError;
}
export enum FileErrors {
  MAX_SIZE = 'FileError_MAX_SIZE',
  MIN_SIZE = 'FileError_MIN_SIZE',
  FILE_TYPE = 'FileError_FILE_TYPE',
  NOT_INITED = 'FileError_NOT_INITED',
  FILE_EXISTS = 'FileError_FILE_EXISTS',
  NO_ERRORS = 'FileError_NO_ERRORS'
}
export interface IFileError {
  err: FileErrors;
  msg: string;
}

export enum DropperErrors {
  EXCEEDS_MAX_FILES_LIMIT = 'DropperError_EXCEEDS_MAX_FILES_LIMIT',
  NO_ERRORS = 'DropperError_NO_ERRORS'
}

export interface IDropperError {
  err: DropperErrors;
  msg: string;
}

export const MAX_ALLOWABLE_FILE_SIZE = 3000000; // 1*1000000 = MB
export const MIN_ALLOWABLE_FILE_SIZE = 0;
export const MAX_FILES_ALLOWED = 12;

export enum ImageTypes {
  image_jpeg = 'image/jpeg',
  image_jpg = 'image/jpg',
  image_gif = 'image/gif',
  image_png = 'image/png',
  image_webp = 'image/webp'
}

@Injectable({
  providedIn: 'root'
})
export class DropperService {
  filesCounter$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  files: IFile[] = [] as IFile[];

  constructor() { }

  /**
   * @description main method to perform necessary inspections for file dropper.  First inspects that the amount of files in 'queue
   *            do not exceed the maximum allowed files.  If all is good, then performs other inspections (called within inspectFiles
   *            method).
   * @param files: File[]
   * @returns object: {goodFiles: IFile[], restrictedFiles: IFile[], dropperError: IDropperError}
   */
  performInspections(files: File[]): {goodFiles: IFile[], restrictedFiles: IFile[], dropperError: IDropperError} {
    const isTooManyFiles = this.checkNotExceedMaxAllowableFiles(files) === DropperErrors.EXCEEDS_MAX_FILES_LIMIT;
    if (isTooManyFiles) {
      console.log(`Received an excess of files(${files.length})!`);
      return {
        goodFiles: null,
        restrictedFiles: null,
        dropperError: {
          err: DropperErrors.EXCEEDS_MAX_FILES_LIMIT,
          msg: `Added too many files. Allowed ${MAX_FILES_ALLOWED} files!`
        } as IDropperError
      };
    }
    console.log(`Excess files inspection passed...`);
    console.log(`inspecting file(s) for restriction errors and separating good from bad(restricted...`);
    const {goodFiles, restrictedFiles} = this.inspectFiles(Array.from(files) as File[]);
    console.log('After separation, files to add...', goodFiles);
    // this.addFiles(goodFiles);
    console.log('files to warn about...', restrictedFiles);
    return {
      goodFiles,
      restrictedFiles,
      dropperError: {
        err: DropperErrors.NO_ERRORS,
        msg: 'Dropper has no errors, inspect restricted files for errors'
      } as IDropperError
    };
  }

  /**
   * @description inspect files for any discrepancies/restriction issues.
   *              Pushes good and bad files into files respective IFiles arrays.
   * @param files a file array
   * @param checkMethodsCallbacks: Array of function/method references to perform inspections
   * @return object: {goodFiles: IFile[], restrictedFiles: IFile[]}
   * @warning also adds to badfiles array.  This method does too much.
   */
  inspectFiles(files: File[] = [], checkMethodsCallbacks?: any[]): {goodFiles: IFile[], restrictedFiles: IFile[]} {
    console.log(`received ${(files).length} files`);
    console.log(`Checking restrictions for each file...`);
    const badFiles: IFile[] = [];
    const inspectedFiles = files
      .map((file: File) => {
        console.log(`Checking file: ${file.name}`);
        const INSPECTION_CALLBACKS = checkMethodsCallbacks || [
          this.checkFileTypeIsAllowed,
          this.checkFileSize,
          this.checkFileExists.bind(this)
        ];
        return this.checkFileForRestrictionErrors(file, INSPECTION_CALLBACKS);
      })
      .filter((result: {file: File, result: FileErrors}) => {
        console.log('separating good files from bad...');
        console.log(result);
        if (result.result === FileErrors.NO_ERRORS) {
          return result;
        }
        badFiles.push({file: result.file, error: {err: result.result, msg: result.result.toString()}});
      });
    // console.log('bad files: ', badFiles);
    // console.log('good files: ', inspectedFiles);
    return {goodFiles: inspectedFiles, restrictedFiles: badFiles};
  }

  /**
   * @description a simple check to see if user added too many files (above allowable limit).  The limit is intended to prevent
   *              excess data overages.  Will consider increasing depending on usage stats.
   */
  checkNotExceedMaxAllowableFiles(files: File[] | IFile[], maxLimit?: number): DropperErrors {
    if (maxLimit === undefined) {
      maxLimit = MAX_FILES_ALLOWED;
    }
    if ((files.length + this.filesCounter$.getValue()) > maxLimit) {
      return DropperErrors.EXCEEDS_MAX_FILES_LIMIT;
    }
    console.log(`filesCounter$(${files.length}) did not count more than ${maxLimit} files. Returning ${DropperErrors.NO_ERRORS}`);
    return DropperErrors.NO_ERRORS;
  }

  /**
   * @description Checks a file for a restriction error.
   * @param file: The file to inspect
   * @param callbackFns[]: The callback functions received.  For use as inspections functions(primarily)
   */
  checkFileForRestrictionErrors(file: File, callbackFns: any[]): IFile {
    let badFile: {file: File, result: FileErrors};
    const goodFile = {file, result: FileErrors.NO_ERRORS}; // tslint: file: file reduced to shorthand
    let errorCount = 0;

    console.log(`Checking file ${file.name} for ${callbackFns.length} types of restrictions...`);
    for (let i = 0, len = callbackFns.length; i < len; i++) { // improvement 'trick' for speed
      const result = callbackFns[i](file);
      console.log(`result: ${result}`);
      if (result !== FileErrors.NO_ERRORS) {
        errorCount++;
        badFile = { file, result };
        break;
      }
    }
    if (badFile) {
      console.log(`Violations: ${errorCount} errors were found`, );
      console.log(`Bad files: `, badFile);
      return badFile;
    }
    return goodFile;
  }

  checkFileSize(file: File, sizeMin: number = MIN_ALLOWABLE_FILE_SIZE || 0, sizeMax: number = MAX_ALLOWABLE_FILE_SIZE || Infinity): FileErrors {
    if (!file) {
      return FileErrors.NOT_INITED;
    }
    if (file.size > sizeMax) {
      return FileErrors.MAX_SIZE;
    }
    if (file.size < sizeMin) {
      return FileErrors.MIN_SIZE;
    }
    return FileErrors.NO_ERRORS;
  }

  checkFileExists(file: File): FileErrors {
    console.log(`Checking if ${file.name} exists in files[] array`);

    if (this.files.length === 0) {
      return FileErrors.NO_ERRORS;
    }

    const exists = this.files.filter((f: IFile) => {
      if ( (f.file.name === file.name) && (f.file.size === file.size) ) {
        return file;
      }
    }).length > 0;

    return exists ? FileErrors.FILE_EXISTS : FileErrors.NO_ERRORS;
  }

  checkFileTypeIsAllowed(file: File, allowedTypes?: string[]): FileErrors {
    const BAD_FILE_TYPE = -1;
    if (!allowedTypes) {
      allowedTypes = [] as string[];
      allowedTypes.push(ImageTypes.image_jpeg);
      allowedTypes.push(ImageTypes.image_jpg);
      allowedTypes.push(ImageTypes.image_png);
      allowedTypes.push(ImageTypes.image_webp);
      allowedTypes.push(ImageTypes.image_gif);
    }
    console.log('Checking file type against ', allowedTypes);
    console.log(allowedTypes.indexOf(file.type));
    if (allowedTypes.indexOf(file.type) !== BAD_FILE_TYPE) {
      console.log(file.name, 'is has a valid image type(', allowedTypes, '!');
      return FileErrors.NO_ERRORS;
    }
    return FileErrors.FILE_TYPE;
  }

  addFiles(files: IFile[]): void {
    files.forEach((file: IFile) => {
      this.files.push(file);
    });
    this.filesCounter$.next(this.files.length);
  }

  /**
   * @description removes files
   * @param index: index to remove from
   * @return returns number of files remaining
   * @warning A javascript gotcha: 0 === !index is TRUE
   */
  removeFiles(index?: number | undefined): number {
    console.log('removeFiles called with index: ', index);
    if (index === null || index === undefined) { // remove allFiles
      console.log('Did not receive index, removing all files...');
      this.files = [] as IFile[];
    }
    if (Number.isNaN(index)) {
      console.error('removeFiles ONLY accepts numbers! Will not do anything to files.');
    }
    if (index >= 0 && !(Number.isNaN(index))) {
      console.log('Have index, slicing...');
      this.files.splice(index, 1);
    }
    this.filesCounter$.next(this.files.length);
    return this.files.length;
  }

  /**
   * @description Extract actual files from IFiles file
   */
  getFilesFromIFile(): File[] {
    return ((files: IFile[]) => {
      return files.map((file: IFile) => file.file);
    })(this.files) as File[];
  }

  blobToFile(theBlob: Blob | string, fileName: string): File {
    // A Blob() is almost a File() - it's just missing the two properties below which will be added
    const obj = new File([theBlob as string], fileName);
    console.log('newly created obj should be a file: ', obj);
    return obj as File;
  }

}
