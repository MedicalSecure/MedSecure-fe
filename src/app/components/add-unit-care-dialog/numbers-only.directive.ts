import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[NumbersOnly]',
  standalone: true
})
export class NumbersOnlyDirective {

  constructor(private el:ElementRef ) { }

  @HostListener('input',['$event'])

  onInputChange(event:any){
    const intialValue=this.el.nativeElement.value
    this.el.nativeElement.value=intialValue.replace(/[^0-9]*/g,'');

    if (intialValue !== this.el.nativeElement.value){
      event.stopProgation()
    }

  }

}
