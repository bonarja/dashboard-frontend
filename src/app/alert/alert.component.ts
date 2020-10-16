import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
    selector: 'Alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    host: { class: 'cover center' },
})
export class AlertComponent implements OnInit {
    @Input('buttons') buttons: Array<any> = [];
    @Input('action') action: Function = null;
    @Input('default') default: string = '';
    @Input('size') size: number = 1;
    type: string = 'question';
    msg: string = '';
    constructor(private me: ElementRef) {}
    items: Array<any> = [];
    blue: string = '#7d98f3';
    red: string = '#fd8993';
    close = (close?: boolean) => {
        if (close === false) return;
        this.me.nativeElement.find('.alert_window').out('zoomOut', 300);
        this.me.nativeElement.out('fadeOut', 300);
    };
    defaults_buttons = [
        {
            name: 'cancelar',
            color: this.red,
            action: this.close,
        },
        {
            name: 'aceptar',
            color: this.blue,
        },
    ];
    open = (
        msg: string = this.default,
        actions_or_buttons?:
            | Function
            | Array<{
                  name: string;
                  color: string | 'blue' | 'red';
                  action: Function | 'close';
                  close?: boolean;
              }>
    ) => {
        this.action = null;
        if (actions_or_buttons) {
            if (typeof actions_or_buttons === 'function') {
                this.action = actions_or_buttons;
                this.items = this.defaults_buttons;
            } else {
                if (Array.isArray(actions_or_buttons)) {
                    this.items = actions_or_buttons;
                }
            }
        } else {
            this.items = [
                {
                    name: 'aceptar',
                    action: 'close',
                },
            ];
        }
        this.msg = msg;
        this.me.nativeElement.find('.alert_window').in('zoomIn', 300);
        this.me.nativeElement.in('fadeIn', 'flex', 300);
    };
    ngOnInit() {}
    getColor(color: string) {
        return color === 'blue'
            ? this.blue
            : color === 'red'
            ? this.red
            : color || this.blue;
    }
    select(num: number) {
        const s = this.items[num];

        if (s.action === 'close') {
            return this.close(s.close);
        }
        if (typeof s.action === 'function') {
            s.action();
            this.close(s.close);
            return;
        }
        if (!s.action && this.action) {
            this.action();
            this.close(s.close);
        }
    }
}
