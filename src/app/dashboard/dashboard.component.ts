import {
    Component,
    OnInit,
    ElementRef,
    Input,
    OnChanges,
    ViewChild,
} from '@angular/core';

import { ApiService } from '../api.service';
import { ToggleComponent } from '../toggle/toggle.component';
import { AngularEventListener } from '../listener';
import { AppData } from '../interfaces/appData';
declare const GLOBAL: any;
@Component({
    selector: 'Dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    host: { class: 'cover' },
})
export class DashboardComponent implements OnInit, OnChanges {
    @Input() identity: any;
    @Input() onlogout: Function;
    @ViewChild('toggle', { static: true }) toggle: ToggleComponent;
    data: Array<AppData>;
    showSettingsButton: boolean = false;
    showSettings: boolean = false;
    isDarkMode: boolean = null;
    isAdmin: boolean = false;
    constructor(
        private me: ElementRef,
        private api: ApiService,
        private listener: AngularEventListener
    ) {
        this.listener.subscribe('dashboard', (apps: Array<AppData>) => {
            this.filterApps(apps);
        });
    }
    ngOnInit(): void {
        // verify no access
        if (location.href.includes('?noaccess')) {
            const cpdeApp = location.href.split('?noaccess=')[1].split('&')[0];

            //FIXME: vista no access
            alert(`Sin acceso a ${cpdeApp}`);
        }

        var storageValue = localStorage.getItem('dark') || '0';
        this.isDarkMode = storageValue == '1' ? true : false;

        this.changeMode(this.isDarkMode);
    }
    ngOnChanges() {
        if (this.identity && this.identity.privileges) {
            // debugger;

            //FIXME: estos no son los privilegios
            // const isAdmin = this.identity.privileges.some((x: string) =>
            //     environment.privilegesToShowSettings.includes(x)
            // );

            this.isAdmin = this.identity.privileges['dashboard'] ? true : false;
            // cargar dashboards
            GLOBAL.loading(true);
            this.api
                .getApps()
                .then((r: Array<AppData>) => {
                    this.filterApps(r);
                })
                .finally(() => GLOBAL.loading(false));

            if (this.isAdmin) {
                // show settings dashboard
                this.showSettingsButton = true;
            }
        }
    }
    formatUrl = (url: String) =>
        url
            .replace('https://', '')
            .replace('www', '')
            .replace('http://', '')
            .replace(/ /g, '');

    filterApps(apps: Array<AppData>) {
        this.data = apps.filter((x) => {
            if (this.isAdmin) return true;
            if (!x.active) return false;
            if (this.identity.privileges['xstore'] && x.xstore) return true;
            if (x.selfroll && this.identity.privileges[x.code]) return true;
        });
    }
    // var dashBoard = S("#dashboard")[0];
    changeMode(value: boolean) {
        value
            ? this.me.nativeElement.addClass('dark')
            : this.me.nativeElement.removeClass('dark');
    }
    toggleSetting() {
        this.showSettings = !this.showSettings;
    }
    onCloseSettings = () => {
        this.showSettings = false;
    };
    logout() {
        this.onlogout && this.onlogout();
    }
    onChangeToggle = (val: boolean) => {
        // console.log(val);
        localStorage.setItem('dark', val ? '1' : '0');
        this.changeMode(val);
    };
}
