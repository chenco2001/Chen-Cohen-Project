import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminUsersComponent } from './pages/users/admin-users.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'users', component: AdminUsersComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}