import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CustomInputComponent } from '../custom-input/custom-input.component';
// import { AlertComponent } from '../alert/alert.component';
import { SlidePage } from '../interfaces/slidePage';
import { TagsComponent } from '../tags/tags.component';
import { ApiService } from '../api.service';
import { AppData } from '../interfaces/appData';
import { AngularEventListener } from '../listener';
declare var SLIDEPAGE: any;
declare const GLOBAL: any;
declare const TOAST: any;

@Component({
    selector: 'addDashboard',
    templateUrl: './add-dashboard.component.html',
    styleUrls: ['./add-dashboard.component.scss'],
})
export class AddDashboardComponent implements OnInit {
    @Input() onclose: Function;
    @Input() ondone: Function;
    @Input() onremove: Function;
    @Input() edit: AppData;
    // @ViewChild('alert', { static: true }) alert: AlertComponent;
    @ViewChild('input_name', { static: true }) input_name: CustomInputComponent;
    @ViewChild('input_code', { static: true }) input_code: CustomInputComponent;
    @ViewChild('input_url', { static: true }) input_url: CustomInputComponent;
    @ViewChild('slider', { static: true }) slider: ElementRef;
    @ViewChild('rolls', { static: true }) rolls: TagsComponent;
    constructor(
        private api: ApiService,
        private listener: AngularEventListener
    ) {}
    initialColor: string = '#7984d2';
    sp: SlidePage;

    dataForm: AppData = {
        url: 'https://',
        color: this.initialColor,
        xstore: false,
        selfroll: false,
    } as any;
    ngOnInit(): void {
        if (this.edit) {
            !this.edit.color && (this.edit.color = this.initialColor);
            this.dataForm = this.edit;

            // this.rolls.list = this.edit.rolls;
            this.rolls.load(this.edit.rolls);
        }
        this.sp = new SLIDEPAGE({
            el: this.slider.nativeElement,
            repeat: false, // default: false
            realNumber: false, // default: false
            direction: 'x', // default: x
            display: 'grid', // default: block
            transition: 300, // default: 250,
            pages: '.add_page', // default sp_page
            onChange: ({ index }) => {
                // {current, previous, index}
                // this.setAtive(index);
            },
        });
    }
    changeInput = (val: any, id?: string) => {
        if (val.color && val.color.hex)
            return (this.dataForm.color = val.color.hex);

        this.dataForm[id] = val;
    };
    callOnClose() {
        this.onclose && this.onclose();
    }
    callOnDone() {
        this.dataForm.rolls = this.rolls.get();
        this.edit ? this.editApp() : this.createApp();
    }
    editApp() {
        GLOBAL.loading(true, 'editando app');
        this.api
            .editApp(this.dataForm)
            .then((r: any) => {
                this.listener.emit('dashboard', r);
                this.onclose();
                TOAST.add(`Se ha modificado la app ${this.dataForm.code}`);
            })
            .finally(() => GLOBAL.loading(false));
    }
    createApp() {
        this.dataForm.active = true;
        console.log(this.dataForm);
        GLOBAL.loading(true, 'creando app');
        this.api
            .createApp(this.dataForm)
            .then((r: any) => {
                this.listener.emit('dashboard', r);
                this.onclose();
                TOAST.add(`Se ha creado la app ${this.dataForm.code}`);
            })
            .finally(() => {
                GLOBAL.loading(false);
            });
    }
    next() {
        this.sp.next();
    }
    prev() {
        this.sp.prev();
    }
}
