import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'custom_input',
    templateUrl: './custom-input.component.html',
    styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
    @Input() type: string = 'text';
    @Input() name: string;
    @Input() placeholder: string;
    @Input() label: boolean = true;
    @Input() autocomplete: boolean = false;
    @Input() labeltext: string;
    @Input() select = [];
    @Input() value: string = '';
    @Input() nid: string;
    @Input() change: Function = null;
    @Input() height: number = 60;
    @ViewChild('selectvalue', { static: false }) selectvalue: ElementRef;
    showOptions: boolean = false;
    showSelectValue: string = null;
    constructor(private me: ElementRef) {}
    ngOnInit() {
        this.nid = this.nid
            ? this.nid
            : this.name.toLowerCase().replace(/ /g, '_');
    }
    callChange() {
        this.change && this.change(this.value, this.nid);
    }
    set = (value: string) => {
        this.value = value;
    };
    selectEvent = (event: any) => {
        setTimeout(() => {
            const target = event.target;
            if (this.me.nativeElement.contains(target)) return;
            window.removeEventListener('click', this.selectEvent, false);
            this.showOptions = false;
        }, 50);
    };
    openSelect() {
        if (!this.showOptions) {
            this.showOptions = true;
            window.addEventListener('click', this.selectEvent, false);
        } else {
            window.removeEventListener('click', this.selectEvent, false);
            this.showOptions = false;
        }
    }

    onselect(num: number) {
        const select = this.select[num];
        this.showSelectValue = select.name;
        this.selectvalue.nativeElement.in('zoomIn', 200);
        this.change && this.change(select.value, this.nid, select.name);
    }
}
