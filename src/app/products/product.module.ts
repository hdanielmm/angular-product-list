import { NgModule } from '@angular/core';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { RouterModule } from '@angular/router';
import { ProductDetailGuard } from './product-detail.guard';
import { ProductEditGuard } from './product-edit/product-edit.guard';
import { SharedModule } from '../shared/shared.module';
import { ProductEditComponent } from './product-edit/product-edit.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    // InMemoryWebApiModule.forRoot(ProductData),
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent },
      {
        path: 'products/:id',
        canActivate: [ProductDetailGuard],
        component: ProductDetailComponent,
      },
      {
        path: 'products/:id/edit',
        canDeactivate: [ProductEditGuard],
        component: ProductEditComponent
      }
    ])
  ],
})
export class ProductModule {}
