import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from "ag-grid-angular";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TimeComponent } from './time/time.component';

import { CoreModule } from './onauth/core.module';
import { SettingsComponent } from './settings/settings.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomInputComponent } from './custom-input/custom-input.component';
// import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorSliderModule } from 'ngx-color/slider';
import { AddDashboardComponent } from './add-dashboard/add-dashboard.component';
import { AlertComponent } from './alert/alert.component';
import { ToggleComponent } from './toggle/toggle.component';
import { TagsComponent } from './tags/tags.component';
import { UsersComponent } from './users/users.component';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { RollsMapComponent } from './rolls-map/rolls-map.component';
import { LoadingComponent } from './loading/loading.component';
import { NoAccessComponent } from './no-access/no-access.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TimeComponent,
    SettingsComponent,
    CustomInputComponent,
    AddDashboardComponent,
    AlertComponent,
    ToggleComponent,
    TagsComponent,
    UsersComponent,
    CustomTableComponent,
    RollsMapComponent,
    LoadingComponent,
    NoAccessComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    CoreModule.forRoot(),
    AgGridModule.withComponents([]),
    AppRoutingModule,
    HttpClientModule,
    ColorSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
