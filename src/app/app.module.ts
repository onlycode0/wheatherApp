import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './components/main/main.component';
import { ManageComponent } from './components/manage/manage.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';



@NgModule({
	declarations: [
		AppComponent, 
		MainComponent, 
		ManageComponent, 
		SettingsComponent, 
		ClickOutsideDirective
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
	],
	providers: [
		provideHttpClient(withInterceptorsFromDi())
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
