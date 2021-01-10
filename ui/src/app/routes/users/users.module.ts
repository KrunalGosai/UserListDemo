import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';

const COMPONENTS = [UserListComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_DYNAMIC
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  entryComponents: COMPONENTS_DYNAMIC
})
export class UsersModule { }
