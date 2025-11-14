import {Directive, ElementRef, HostListener, output, type OutputEmitterRef} from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutside {

  public clickOutside: OutputEmitterRef<void> = output<void>();
  private elementRef: ElementRef;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  @HostListener('document:click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (this.elementRef.nativeElement.contains(event.target) === false) {
      this.clickOutside.emit();
    }
  };

}
