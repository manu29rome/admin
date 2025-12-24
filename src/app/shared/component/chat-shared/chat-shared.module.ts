import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';



@NgModule({
  declarations: [
    ImageViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ImageViewerComponent
  ]
})
export class ChatSharedModule { }
