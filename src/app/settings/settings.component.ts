import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataDashboard } from '../interfaces/DataDashboard';
import { AppData } from '../interfaces/appData';
import { AlertComponent } from '../alert/alert.component';
import { ApiService } from '../api.service';
import { AngularEventListener } from '../listener';
declare const GLOBAL: any;
declare const TOAST: any;
@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    host: { class: 'cover center' },
})
export class SettingsComponent implements OnInit {
    @Input() onclose: Function;
    @Input() onadd: Function;
    @Input() onedit: Function;
    @Input() onremove: Function;
    @Input() data: Array<DataDashboard>;
    @Input() apps: Array<AppData>;
    @ViewChild('alert', { static: true }) alert: AlertComponent;
    showAdd: any = false;
    select: DataDashboard = null;
    title: string = 'Ajustes';
    settingTarget: string = 'menu';
    editApp: AppData;
    list = [
        {
            name: 'apps',
            color: 'coral',
            id: 'apps',
        },
        {
            name: 'users',
            color: '#03A9F4',
            id: 'users',
        },
    ];
    constructor(
        private api: ApiService,
        private listener: AngularEventListener
    ) {}

    ngOnInit(): void {}
    // ngOnChanges(): void {
    //     // console.log('test', this.apps);
    // }
    onSelect(x: DataDashboard) {
        this.select = null;
        setTimeout(() => {
            this.select = x;
        }, 10);
    }
    callOnClose = () => {
        this.onclose && this.onclose();
    };
    closeAdd = () => {
        this.showAdd = false;
    };
    onDoneAddDashboard = (dataDashboard: DataDashboard) => {
        this.showAdd = false;
        // console.log(dataDashboard);
        if (this.onadd) {
            this.onadd(dataDashboard);
        }
        //FIXME: verificar si ya existe la url en la lista
    };
    onDoneEdit = (dataDashboard: DataDashboard) => {
        this.onadd && this.onedit(dataDashboard);
    };
    onRemove = (id: string) => {
        this.select = null;
        this.onremove && this.onremove(id);
    };
    onClickInAdd() {
        this.select = null;
        this.showAdd = true;
    }
    open(id: string) {
        this.title = this.list.filter((x) => x.id === id).pop().name;
        this.settingTarget = id;
    }
    backMenu() {
        this.settingTarget = 'menu';
    }
    edit(item: AppData) {
        this.showAdd = Object.assign({}, item);
    }
    remove(item: AppData) {
        this.alert.open(`¿Desea eliminar la app ${item.name} ?`, () => {
            GLOBAL.loading(true, 'Elimiando');
            this.api
                .removeApp(item.id)
                .then((r: any) => {
                    if (r.error) return;
                    TOAST.add(`Se ha eliminado la app: ${item.code}`);
                    this.listener.emit('dashboard', r);
                })
                .finally(() => GLOBAL.loading(false));
        });
    }
}
