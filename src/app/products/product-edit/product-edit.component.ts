import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NumberValidators} from '../../shared/number.validator';
import {GenericValidator} from '../../shared/generic-validator';
import {IProduct} from '../product.interface';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  pageTitle = 'Product edit';
  errorMessage: string;
  productForm: FormGroup;

  product: IProduct | undefined;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags(): FormArray {
    return this.productForm.get('tags') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      productName: {
        required: 'Product name is required.',
        minLength: 'Product name must be at least three characters.',
        maxLength: 'Produc name cannot exceed 50 characters.'
      },
      productCode: {
        required: 'Product code is required.'
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }


  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      productCode: ['', Validators.required],
      starRating: [null, NumberValidators.range(1, 5)],
      tags: this.fb.array([]),
      description: ''
    });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getProduct(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getProduct(id: number): void {
    debugger;
    this.productService.getProduct(id).subscribe({
      next: (product: IProduct) => this.displayProduct(product),
      error: err => this.errorMessage = err
    });
  }

  displayProduct(product: IProduct): void {
    if (this.productForm) {
      this.productForm.reset();
    }
    this.product = product;

    if (this.product.productId === 0) {
      this.pageTitle = 'Add Product';
    } else {
      this.pageTitle = `Edit Product: ${this.product.productName}`;
    }

    this.productForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description
    });
    this.productForm.setControl('tags', this.fb.array(this.product.tags || []));
  }

}
