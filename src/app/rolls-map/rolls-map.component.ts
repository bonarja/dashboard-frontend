import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AppData } from '../interfaces/appData';
import { SlidePage } from '../interfaces/slidePage';
import { Utility } from '../utility';
declare var SLIDEPAGE: any;
@Component({
    selector: 'RollsMap',
    templateUrl: './rolls-map.component.html',
    styleUrls: ['./rolls-map.component.scss'],
})
export class RollsMapComponent implements OnInit {
    @Input() apps: Array<AppData>;
    @Input() rolls: Array<{ [app: string]: Array<string> }>;
    select: AppData;
    userRolls: Array<AppData> = [];
    @ViewChild('slider', { static: true }) slider: ElementRef;
    sp: SlidePage;
    indexApps: { [app: string]: AppData };
    constructor(private utility: Utility) {}

    ngOnInit(): void {
        this.indexApps = this.utility.arrayIndex(this.apps, 'code');

        var tmpUserRolls: Array<AppData> = [];
        if (this.rolls) {
            Object.entries(this.rolls).forEach((x: any) => {
                const appName: string = x[0];
                const rolls: Array<string> = x[1];
                tmpUserRolls.push(
                    Object.assign({}, this.indexApps[appName], { rolls })
                );
            });
            this.userRolls = tmpUserRolls;
        }

        this.sp = new SLIDEPAGE({
            el: this.slider.nativeElement,
            repeat: false, // default: false
            realNumber: false, // default: false
            direction: 'x', // default: x
            display: 'grid', // default: block
            transition: 300, // default: 250,
            pages: '.page_roll', // default sp_page
        });
    }
    openApp(app: AppData) {
        this.select = app;
        this.sp.go(1);
    }
    closeApp() {
        this.select = null;
        this.sp.go(0);
    }
    removeRoll(app: AppData, roll: string) {
        this.utility.arrayRemoveFind(app.rolls, roll);
        // verificar para remover app
        !app.rolls.length && this.utility.arrayRemoveFind(this.userRolls, app);
    }
    addRoll(roll: string) {
        var el: AppData;

        for (let i = 0; i < this.userRolls.length; i++) {
            if (this.userRolls[i].code === this.select.code) {
                el = this.userRolls[i];
                break;
            }
        }

        if (!el) {
            // crear app en el roll y agregar roll
            this.userRolls.push(
                Object.assign({}, this.select, { rolls: [roll] })
            );
            return;
        }

        // verificar si existe roll
        if (el.rolls.includes(roll)) return;

        // agregar roll
        el.rolls.push(roll);
    }
    getRolls() {
        return this.userRolls.reduce((acum: any, item: AppData) => {
            acum[item.code] = item.rolls;
            return acum;
        }, {});
    }
}
