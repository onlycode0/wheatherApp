import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ManageComponent } from './components/manage/manage.component';

const routes: Routes = [
	{ path: '', redirectTo: '/main', pathMatch: 'full' },
	{ path: 'main', component: MainComponent },
	{ path: 'settings', component: SettingsComponent },
	{ path: 'manage', component: ManageComponent },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule],
})
export class AppRoutingModule { }
