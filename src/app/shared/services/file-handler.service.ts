import { Injectable } from '@angular/core';
import { DropperService } from '../../dropper/dropper.service';

/**
 * @description this service is more of a utility service. At the moment it reduces code for the drag and drop events.
 * @warning  Possible circular dependency with the dropper service?
 */

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor(private dropperService: DropperService) { }

  /**
   * @description begin inspecting files. Will separate the good from the restricted. Can also give
   *            a possible error for the dropper in the case of too many files trying to be added.
   * @param files: File[]
   * @return boolean: (true)if there are any good files
   */
  inspectFiles(files: File[]): boolean {
    const {goodFiles, restrictedFiles , dropperError} = this.dropperService.performInspections(files);
    console.log('After performing inspections, result: ');
    console.log(goodFiles, restrictedFiles, dropperError);
    if (goodFiles !== null && goodFiles.length > 0) {
      this.dropperService.addFiles(goodFiles);
      console.log(`emitting ${goodFiles.length > 0} to parent...`);
      return goodFiles.length > 0;
    }
    console.log('goodFiles.length is not > 0!');
    return false;
  }
}
