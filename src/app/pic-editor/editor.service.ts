import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum EditedStates {
  UNEDITED = 'editedState_UNEDITED',
  CROPPED = 'editedState_CROPPED',
  ZOOMED_IN = 'editedState_ZOOMED_IN',
  ZOOMED_OUT = 'editedState_ZOOMED_OUT',
  ROTATED_LEFT = 'editedState_ROTATED_LEFT',
  ROTATED_RIGHT = 'editedState_ROTATED_RIGHT',
  SAVED = 'editedState_SAVED',
  CANCELLED = 'editedState_CANCELLED'
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private isEdited: BehaviorSubject<EditedStates> = new BehaviorSubject(EditedStates.UNEDITED);

  constructor() { }

  /**
   *
   * @param object: File | Blob | MediaSource object to create an object URL for.File | Blob
   */
  createUrlFromFile(object: File | Blob | MediaSource): string {
    /**
     *  From Mozilla (mdn):
     *  The URL.createObjectURL() static method creates a DOMString containing a URL representing
     *  the object given in the parameter. The URL lifetime is tied to the document in the window
     *  on which it was created. The new object URL represents the specified File object or Blob
     *  object.
     *
     *  To release an object URL, call revokeObjectURL().
     *
     *  @return A DOMString containing an object URL that can be used to reference the contents of
     *  the specified source object.
     *
     *  @warn release the object or there will be a memory leak!
     *        eg: Set up the image's load event handler to release the object URL since it's no longer
     *        needed once the image has been loaded. This is done by calling the window.URL.revokeObjectURL()
     *        method and passing in the object URL string as specified by img.src.
     */
    return URL.createObjectURL(object);
  }

  setEditedState(state: EditedStates) {
    this.isEdited.next(state);
  }

  getEditedState(): EditedStates {
    return this.isEdited.getValue();
  }

  getIsEdited(): Observable<EditedStates> {
    return this.isEdited.asObservable();
  }
}
