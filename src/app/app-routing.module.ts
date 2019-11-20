import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import {HomeComponent} from "./home/home.component";



import { AuthGuard } from './shared/auth/auth-guard.service';

const appRoutes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'full-layout',
  //   pathMatch: 'full',
  // },
 
  { path: '', component: HomeComponent, data: { title: 'content Views' }, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
