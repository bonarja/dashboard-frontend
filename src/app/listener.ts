import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AngularEventListener {
    private np: string = 'ANGULARLISTENER'; //namespace
    constructor() {
        !window[this.np] && (window[this.np] = {});
    }
    listener = (): any => window[this.np];
    emit(name: string, value?: any) {
        Array.isArray(this.listener()[name]) &&
            this.listener()[name].forEach((x: Function) => {
                value ? x(value) : x();
            });
    }
    subscribe(name: string, fn: Function) {
        !this.listener()[name] && (this.listener()[name] = []);
        this.listener()[name].push(fn);
    }
    unSuscribeAll(name: string) {
        window[this.np][name] = [];
    }
}
