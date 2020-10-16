import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'Toggle',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent implements OnInit {
    @Input('name') name: string = null;
    @Input() value: boolean = false;
    @Input('onchange') onchange: Function = null;
    @Input('nid') nid: string = null;
    @ViewChild('input', { static: true }) input: ElementRef;
    id: string;
    constructor() {}

    ngOnInit() {
        this.id = `Toggle-${this.nid || this.name.toLowerCase()}-${Date.now()}`;
        const el: HTMLInputElement = this.input.nativeElement;
        el.checked = this.value;
        const id = this.nid || this.name.toLowerCase().replace(' ', '_');
        el.onchange = () => {
            this.value = el.checked;
            this.onchange && this.onchange(el.checked, id);
        };
    }
    set(val: boolean) {
        const el: HTMLInputElement = this.input.nativeElement;
        console.log(el, val);
        el.checked = true;
    }
}
