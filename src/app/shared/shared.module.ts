import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

const CustomModules: any[] = [
]
const AngularModules: any[] = [
  CommonModule,
]
@NgModule({
  declarations: [],
  imports: [
    ...AngularModules,
    ...CustomModules,
  ],
  exports: [
    ...AngularModules,
    ...CustomModules,
  ]
})
export class SharedModule { }
