import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataDashboard } from './interfaces/DataDashboard';
import { AppData } from './interfaces/appData';
import { UserData } from './interfaces/userData';
declare const GLOBAL: any;
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  path: string;
  timeout_v: number;
  constructor(private http: HttpClient) {
    this.path = environment.node;
    this.timeout_v = 20000;
  }
  callApi(path: any, ...rest: Array<any>) {
    let data: any, call: string;
    if (typeof path === 'object') {
      path.data && (data = path.data);
      path.path && (path = path.path);
    } else {
      path = (this.path.slice(-1) === '/' ? this.path : this.path + '/') + path;
    }
    rest.forEach((x) => {
      typeof x === 'object' ? (data = x) : (call = x);
    });
    // agregar token al data request si existe
    const token = localStorage.getItem('access_token');
    !data && (data = {});
    data = Object.assign({}, data);
    token && (data.token = token); // enviar el token si existe
    // end
    const request = (type_request: string) =>
      new Promise((done, reject) => {
        this.http[type_request](path, data)
          .pipe(timeout(this.timeout_v))
          .subscribe(
            (result: any) => {
              if (result === null) {
                return reject('Undefined response');
              }

              if (call) {
                if (result[call].error) {
                  if (result[call].error === 'LOGOUT') {
                    //FIXME: accion para desconectar
                    // localStorage.clear();
                    return;
                  }
                  return reject(result[call].error);
                }
                done(result[call]);
              } else {
                if (typeof result === 'object' && result.error) {
                  if (result.error === 'NO_ACCESS') {
                    GLOBAL.alert('Sin Acceso');
                    return;
                  }
                  if (result.error === 'LOGOUT') {
                    // this.ssoEventListener.emit('logout');
                    //FIXME: accion para desconectar
                    return;
                  }
                  GLOBAL.alert(result.error);
                  return reject(result.error);
                } else {
                  done(result);
                }
              }
            },
            (error: any) => reject(error)
          );
      });
    return {
      post: () =>
        new Promise((done, reject) => {
          request('post')
            .then((r) => done(r))
            .catch((err) => {
              GLOBAL.alert(err);
              console.log(err);
              reject(err);
            });
        }),
      get: () =>
        new Promise((done, reject) => {
          request('get')
            .then((r) => done(r))
            .catch((err) => {
              GLOBAL.alert(err);
              console.log(err);
              reject(err);
            });
        }),
    };
  }

  getDate = () => this.callApi('date').get();
  // -------- <><>  APPS <><> --------------
  getApps = () => this.callApi('app/list').post();
  createApp = (app: AppData) => this.callApi('app/create', app).post();
  removeApp = (id: string) => this.callApi('app/remove', { id }).post();
  editApp = (app: AppData) => this.callApi('app/update', app).post();

  // -------- <><> USERS <><> --------------
  getUsers = () => this.callApi('user/list').post();
  createUser = (user: UserData) => this.callApi('user/create', user).post();
  updateUser = (user: UserData) => this.callApi('user/update', user).post();
  removeUser = (id: string) => this.callApi('user/remove', { id }).post();
}
