import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SortablejsModule } from 'angular-sortablejs';

import { AppComponent } from './app.component';
import { PromptFilesViewComponent } from './dropper/prompt-files/prompt-files-view.component';
import { HasFilesViewComponent } from './dropper/has-files-view/has-files-view.component';
import { ContentBarComponent } from './dropper/has-files-view/content-bar/content-bar.component';
import { ThumbnailContainerComponent } from './thumbnail-container/thumbnail-container.component';
import { StatusBarComponent } from './dropper/has-files-view/status-bar/status-bar.component';
import { PicEditorComponent } from './pic-editor/pic-editor.component';

import { DropperService } from './dropper/dropper.service';
import { ThumbnailService } from './thumbnail-container/thumbnail.service';
import { FileHandlerService } from './shared/services/file-handler.service';

import { DropzoneDirective } from './shared/directives/dropzone.directive';

@NgModule({
  declarations: [
    AppComponent,
    PromptFilesViewComponent,
    HasFilesViewComponent,
    ContentBarComponent,
    ThumbnailContainerComponent,
    StatusBarComponent,
    PicEditorComponent,
    DropzoneDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    SortablejsModule.forRoot({animation: 150})
  ],
  providers: [
    DropperService,
    ThumbnailService,
    FileHandlerService,
    // FileReaderService -> provided in appropriate components - requires 1 per component to prevent
    // file reader already reading error
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    PicEditorComponent
  ]
})
export class AppModule { }
