import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IProduct } from './product.interface';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  private productsUrl = 'api/products/products.json';

  constructor(private http: HttpClient) {}
  
  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productsUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  // getProduct(id: number): Observable<IProduct> {
  //   if(id === 0) {
  //     return of(this.initializeProduct())
  //   }
  //   debugger;
  //   const url = `${this.productsUrl}/${id}`;
  //   return this.http.get<IProduct>(url)
  //     .pipe(
  //       tap(data => console.log('getProduct: ' + JSON.stringify(data))),
  //       catchError(this.handleError)
  //   );
  // }

  getProduct(id: number): Observable<IProduct> {
    return this.getProducts()
      .pipe(
        map((products: IProduct[]) => products.find(p => p.productId === id))
      );
  }

  private handleError(err: HttpErrorResponse){
    let errorMessage = '';
    if(err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  private initializeProduct(): IProduct {
    return {
      productId: 0,
      productName: null,
      productCode: null,
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null
    }
  }
}