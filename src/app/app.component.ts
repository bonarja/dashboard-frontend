import { Component, ViewChild } from '@angular/core';
import { AuthService } from './onauth/auth.service';
import { AuthResponse } from './onauth/auth-response.interface';
import { Observable } from 'rxjs';
import { OAuthService, OAuthErrorEvent } from 'angular-oauth2-oidc';
import { ApiService } from './api.service';
import { AlertComponent } from './alert/alert.component';

declare const GLOBAL: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  identityForDashboard: any = false;
  showDashboard: boolean = false;
  // onauth
  isAuthenticated: boolean;
  isDoneLoading: Observable<boolean>;
  canActivateProtectedRoutes: Observable<boolean>;
  @ViewChild('alert') alert: AlertComponent;
  constructor(
    private authService: AuthService,
    private oauthService: OAuthService,
    private api: ApiService
  ) {
    window.addEventListener(
      'message',
      (e: any) => {
        const { action } = e.data;
        if (action === 'logout') return this.authService.logout();
        if (action === 'reload') {
          // const dark = localStorage.getItem('dark');
          // localStorage.clear();
          // localStorage.setItem('dark', dark);
          location.reload();
          // return;
        }
      },
      false
    );

    !this.inIframe() && (this.showDashboard = true);

    GLOBAL.loading();
    this.authService.isAuthenticated$.subscribe(
      (value) => (this.isAuthenticated = value)
    );
    this.isDoneLoading = this.authService.isDoneLoading$;
    this.canActivateProtectedRoutes = this.authService.canActivateProtectedRoutes$;
    this.oauthService.customQueryParams = {
      token: localStorage.getItem('access_token'),
    };

    // verify time diference
    this.api.getDate().then(({ date }) => {
      const serverDate: any = new Date(date);
      const localDate: any = new Date();
      var hoursDiff = Math.abs(localDate - serverDate) / 36e5;

      if (hoursDiff >= 12) {
        // out of date time
        this.alert.open(
          `<div class="center y centerText"> 
        <h2>⏱</h2>
        <h3>La fecha / hora del dispositivo es incorrecta.</h3>
      </div>`,
          []
        );
        GLOBAL.loading(false);
      } else {
        // init sso
        this.authService.runInitialLoginSequence();
      }
    });

    // this.oauthService.loadDiscoveryDocumentAndTryLogin();

    const getLogin = () => {
      (window.opener || window.parent).postMessage(
        {
          action: 'showLogin',
        },
        '*'
      );
    };
    // error observable
    this.oauthService.events.subscribe((event: any) => {
      // debugger
      console.log(event);
      console.log(event.params);

      if (event instanceof OAuthErrorEvent) {
        // debugger

        // if (!environment.production) debugger;

        console.log('ERROR ->>>', event);
        const dark = localStorage.getItem('dark');
        localStorage.clear();
        localStorage.setItem('dark', dark);
        this.deleteAllCookies();
        console.log(event.reason);
        console.log(event.type);

        (window.opener || window.parent).postMessage(
          {
            action: 'reloadAndShowLogin',
          },
          '*'
        );

        //FIXME: remove storage and cockies always
        // const paramsError = event.params
        //   ? event.params['error'] || false
        //   : false;

        // // "consent_required"
        // if (event.type.includes('error') && paramsError !== 'login_required') {
        //   const dark = localStorage.getItem('dark');
        //   localStorage.clear();
        //   localStorage.setItem('dark', dark);
        // }

        location.reload();
        return;
      }

      if (
        event.type === 'user_profile_loaded' ||
        event.type === 'silently_refreshed' ||
        event.type === 'discovery_document_loaded'
      ) {
        this.oauthService.customQueryParams = {
          token: this.accessToken,
        };
        // logueado (send data)
        (window.opener || window.parent).postMessage(
          {
            action:
              event.type === 'silently_refreshed' ? 'refresh' : 'sendAuth',
            value: {
              token: this.accessToken,
              identity: this.identityClaims,
            },
          },
          '*'
        );
      }
      // else if (event.type === 'token_expires') {
      //   getLogin();
      // }
      // else if (event.type === 'silent_refresh_timeout') {
      //   getLogin();
      // }
    });
    this.isDoneLoading.subscribe(async (r) => {
      // debugger;
      // no autenticado
      if (
        !this.isAuthenticated ||
        !this.hasValidToken ||
        !this.identityClaims
      ) {
        console.log('hacer login');
        // hacer login
        (window.opener || window.parent).postMessage(
          {
            action: 'showLogin',
          },
          '*'
        );
        return this.authService.login();
      }
      GLOBAL.loading(false);
      this.identityForDashboard = this.identityClaims;
      console.log(this.identityClaims);
    });
  }
  deleteAllCookies() {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf('=');
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
  logout() {
    this.authService.logout();
  }
  inIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  get accessToken() {
    return this.authService.accessToken;
  }
  get identityClaims(): AuthResponse {
    return this.authService.identityClaims as AuthResponse;
  }
  get idToken() {
    return this.authService.idToken;
  }
  get hasValidToken() {
    return this.authService.hasValidToken();
  }
  onlogout = () => {
    // logout from dashboard component
    this.logout();
  };
}
