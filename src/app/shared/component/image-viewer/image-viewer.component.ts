import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/login.services/auth.service';
import { DEFAULT_COLORS, BASE_URLS, DATA } from '../../../config/constants';

@Component({
    selector: 'app-image-viewer',
    imports: [CommonModule],
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent {
  @Input() imageUrl: string = '';

  public iconPlus: string = BASE_URLS.URL_FRONT.concat("/icon/default/plus.png");
  public iconDowland: string = BASE_URLS.URL_FRONT.concat("/icon/default/dowland.png");
  public iconLess: string = BASE_URLS.URL_FRONT.concat("/icon/default/less.png");
  public iconClosed: string = BASE_URLS.URL_FRONT.concat("/icon/default/closed.png");

  clientData: any = {};

  isOpen: boolean = false;
  private isDragging: boolean = false;

  zoomLevel: number = 1;
  panX: number = 0;
  panY: number = 0;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  constructor(private authservice: AuthService) {}

  ngOnInit(): void {
    this.colorDefaul();
  }

  colorDefaul() {
    const storedData = this.authservice.getClient();
    if (storedData) {
      this.clientData = JSON.parse(storedData);
    }
  }

  openViewer(url: string) {
    this.imageUrl = url;
    this.isOpen = true;
    this.zoomLevel = 1;
    this.panX = 0;
  this.panY = 0;
  }

  closeViewer() {
  this.isOpen = false;
  this.zoomLevel = 1;
  this.panX = 0;
  this.panY = 0;
}

  zoomIn() {
    if (this.zoomLevel < 3) {
      this.zoomLevel += 0.1;
    }
  }

  zoomOut() {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.1;
    }
  }

  onWheel(event: WheelEvent) {
  event.preventDefault();
  const delta = -event.deltaY;

  const zoomStep = 0.1;
  if (delta > 0) {
    this.zoomLevel = Math.min(this.zoomLevel + zoomStep, 5); // Máximo zoom
  } else {
    this.zoomLevel = Math.max(this.zoomLevel - zoomStep, 0.2); // Mínimo zoom
  }
}

onMouseDown(event: MouseEvent) {
  this.isDragging = true;
  this.lastMouseX = event.clientX;
  this.lastMouseY = event.clientY;
}

onMouseMove(event: MouseEvent) {
  if (!this.isDragging) return;

  const dx = event.clientX - this.lastMouseX;
  const dy = event.clientY - this.lastMouseY;

  this.panX += dx;
  this.panY += dy;

  this.lastMouseX = event.clientX;
  this.lastMouseY = event.clientY;
}

onMouseUp() {
  this.isDragging = false;
}

}
