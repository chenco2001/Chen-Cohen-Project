import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

import { ProfileComponent } from './auth/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserDetailsComponent } from './auth/user-details/user-details.component';
import { ProfileEditComponent } from './auth/profile-edit/profile-edit.component';

const routes: Routes = [
  // ===== main pages =====
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'about-us', component: AboutUsComponent },

  // ===== auth/profile (nested) =====
{
  path: 'profile',
  component: ProfileComponent,
  children: [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'edit', component: ProfileEditComponent },
    { path: 'user-details', component: UserDetailsComponent },
    { path: '', redirectTo: 'user-details', pathMatch: 'full' },

  ],
},

  // ===== aliases =====
  { path: 'login', redirectTo: 'profile/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'profile/register', pathMatch: 'full' },
  { path: 'user-details', redirectTo: 'profile', pathMatch: 'full' },
    // ===== admin =====
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
},
  // ===== fallback =====
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}