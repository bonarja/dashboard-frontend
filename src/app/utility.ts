import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Utility {
    private formatter: Intl.NumberFormat;
    constructor() {}
    formatMoney(value: string | number) {
        const formatter = new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currencyDisplay: 'symbol',
            currency: 'CAD',
        });
        typeof value === 'string' && (value = Number(value));
        return formatter.format(value);
    }
    formatDate(date: string, format: string = 'dd/mm/yyyy'): string {
        let r = date.split(/-|T|\/| /g);
        let m: string, d: string, y: string;
        if (r[0].length > 2) {
            y = r[0];
            m = r[1];
            d = r[2];
        } else {
            d = r[0];
            m = r[1];
            y = r[2];
        }
        let _format = format.toLowerCase().split(/\/|-/);
        const getVal = (n: number) => {
            let ff = _format[n];
            if (ff === 'dd') return d;
            if (ff === 'mm') return m;
            if (ff === 'yyyy') return y;
        };
        let separator = format.includes('/') ? '/' : '-';
        return `${getVal(0)}${separator}${getVal(1)}${separator}${getVal(2)}`;
    }
    orderBy(data: Array<any>, p: string, number: boolean = false): Array<any> {
        return data.slice(0).sort(function (a, b) {
            if (!number) {
                a[p] = a[p].toLowerCase();
                b[p] = b[p].toLowerCase();
            } else {
                a[p] = Number(a[p]);
                b[p] = Number(b[p]);
            }
            return a[p] > b[p] ? 1 : a[p] < b[p] ? -1 : 0;
        });
    }
    arrayRemove(array: Array<any>, value: number): Array<any> {
        return array.splice(value, 1);
    }
    arrayRemoveFind(array: Array<any>, filter: any): Array<any> {
        const item = array.filter((x) => {
            for (let key in filter) {
                if (x[key] !== filter[key]) {
                    return false;
                }
            }
            return true;
        })[0];
        if (item) {
            return array.splice(array.indexOf(item), 1);
        }
        return [];
    }
    arrayIndex(
        data: Array<any>,
        key: string,
        processKey: Function = null
    ): any {
        return data.reduce((acumulador, current, index) => {
            index === 0 && (acumulador = {});
            if (processKey) {
                acumulador[processKey(current[key])] = current;
            } else {
                acumulador[current[key]] = current;
            }
            return acumulador;
        }, 0);
    }
}
