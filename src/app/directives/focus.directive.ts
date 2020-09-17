import { Directive, ElementRef, HostListener, Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 *  The Service
 */
@Injectable({
  providedIn: 'root'
})
export class FocusService {

  private static seleted = null;
  private stopListening: Subject<null> = new Subject();

  public selectedElement(elm: HTMLElement): void {
    if (FocusService.seleted === null) FocusService.seleted = elm;
    if (FocusService.seleted !== elm) FocusService.seleted.innerHTML = 'FOCUS LOSS ON :' + FocusService.seleted.className;
    FocusService.seleted = elm;
    this.listenToClickOutSide();
    this.listenToWindowBlur();
  }

  private clearSelected() {
    if (FocusService.seleted) {
      FocusService.seleted.innerHTML = 'FOCUS LOSS ON :' + FocusService.seleted.className;
      FocusService.seleted = null;
      this.stopListening.next();
    }
  }

  private listenToClickOutSide(): void {
    const mouseDown$ = fromEvent(window, 'mousedown');
    mouseDown$.pipe(
      takeUntil(this.stopListening),
    ).subscribe( elm => {
      if(FocusService.seleted !== elm.target) this.clearSelected();
    });
  }

  public listenToWindowBlur(): void {
    const windowBlur$ = fromEvent(window, 'blur');
    windowBlur$.pipe(
      takeUntil(this.stopListening),
    ).subscribe( elm => {
      if(FocusService.seleted !== elm.target) this.clearSelected();
    });
  }
}


/**
 * The Directive
 */
@Directive({
  selector: '[appFocus]'
})
export class FocusDirective {

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    if(this.elementRef.nativeElement ===  event.target) this.elementSelected();
  }

  constructor(private elementRef: ElementRef, private readonly focusServie: FocusService) {
  }

  private elementSelected(): void {
    this.focusServie.selectedElement(this.elementRef.nativeElement);
      this.elementRef.nativeElement.innerHTML = `FOCUS ON : ${this.elementRef.nativeElement.className}`;
  }
}
