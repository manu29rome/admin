import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appCustomTooltip]',
})
export class CustomTooltipDirective {
  @Input('appCustomTooltip') tooltipData: { text: string; color?: string } | null = null;

  tooltipElement!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipData?.text) return;

    const bgColor = this.tooltipData.color?.trim() || '#000';

    this.tooltipElement = this.renderer.createElement('span');
    this.tooltipElement.innerText = this.tooltipData.text;

    this.renderer.appendChild(document.body, this.tooltipElement);

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'padding', '8px 14px');
    this.renderer.setStyle(this.tooltipElement, 'background-color', bgColor);
    this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
    this.renderer.setStyle(this.tooltipElement, 'border-radius', '8px');
    this.renderer.setStyle(this.tooltipElement, 'font-size', '13px');
    this.renderer.setStyle(this.tooltipElement, 'box-shadow', '0 2px 8px rgba(0, 0, 0, 0.3)');
    this.renderer.setStyle(this.tooltipElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'white-space', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease-in-out');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');

    // Ajustar la posición justo debajo del elemento
    const rect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    // Esperamos a que se renderice y después posicionamos

      const tooltipWidth = this.tooltipElement.offsetWidth;
      const left =  40;

      this.renderer.setStyle(this.tooltipElement, 'top', `${rect.bottom + 2}px`);
      this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
   
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
    }
  }
}
