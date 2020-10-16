import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { Utility } from '../utility';

@Component({
    selector: 'TagsManagement',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
    @Input() label: string;
    @ViewChild('input', { static: true }) input: CustomInputComponent;
    name: string;
    list: Array<{ name: string; removable: boolean }> = [];
    constructor(private utility: Utility) {}
    ngOnInit(): void {}
    changeInput = (val: string) => {
        this.name = val;
    };
    load(list: Array<string>) {
        this.list = list.map((x) => ({ name: x, removable: false }));
    }
    get(): Array<string> {
        return this.list.map((x) => x.name);
    }
    done() {
        if (/ |,/.test(this.name)) return;
        this.list.push({ name: this.name.toLowerCase(), removable: true });
        this.input.value = '';
    }
    remove(index: number) {
        this.utility.arrayRemove(this.list, index);
    }
}
