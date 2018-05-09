import { Contact } from './../model/contact';
import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { promise } from 'selenium-webdriver';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

  data: Contact;
  private base_url = 'http://localhost:8080/Demo';
  constructor(private _http: HttpClient ) { }

  fetchAll(): Observable<Contact[]> {
    console.log('Inside FetchAll method');
     return this._http.get<Contact[]>(this.base_url + '/getAllContacts');

}

 insertRecord(data): Observable<Contact> {
   return this._http.post<Contact>(this.base_url, data);
 }


deleteRecord(id) {
  return this._http.delete(this.base_url + '/' + id);
}


UpdateContact(data: Contact): Observable<Contact> {
  console.log(data.id, data);
  return this._http.put<Contact>(this.base_url + '/' + data.id, data);
}
private handleError(error: any): Promise<any> {
  console.error('Some error occured', error);
  return Promise.reject(error.message || error);
}
}
