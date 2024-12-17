import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './components/main/main.component';
import { ManageComponent } from './components/manage/manage.component';
import { SettingsComponent } from './components/settings/settings.component';



@NgModule({
    declarations: [AppComponent, MainComponent, ManageComponent, SettingsComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
    ],
    providers: [
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
