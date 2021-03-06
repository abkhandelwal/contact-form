import { Contact } from './../../model/contact';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup ,  ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { JsonPipe } from '@angular/common/src/pipes/json_pipe';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  form: FormGroup;
  con: Contact[];
  contact: Contact;
 newcon: Contact = new Contact();
  Flag: boolean;
  ShowAllFlag: boolean;
  constructor( private _auth: AuthService, private _http: HttpClient, private _form: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.Flag = false;
  }

  isFieldValid(field: string) {
    console.log('is field Valide called');
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  getAll(): void {
    // console.log('==========================inside getAll');
    // this._http.get<Contact[]>('http://localhost:8080/Demo/getAllContacts').subscribe(data => {
    //  this.con = data;
    this.Flag = true;
    this.ShowAllFlag = false;
    this._auth.fetchAll().subscribe(resp => {
      this.con = resp;

    });
    }
    createForm() {
      this.form = this._form.group({
        name: ['', Validators.required],
        phoneno:  ['', Validators.required],
        country:  ['', Validators.required]
      });
    }
      contactForm() {

        console.log(this.form);
        if (this.form.valid) {
          this.ShowAllFlag = true;
          this.Flag = false;
         this._auth.insertRecord(this.form.value).subscribe(resp => {
           console.log('record Insreted' + JSON.stringify(resp));
           this.contact = resp;
           this.form.reset();
         });
          console.log('form submitted');
        } else {
          this.validateAllFormFields(this.form);
        }
     //  this.getAll();
      }


      validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
          console.log(field);
          const control = formGroup.get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          }
        });
      }

      deleteContact(id: string) {
     this._auth.deleteRecord(id).subscribe(resp => {
    console.log('contact deleted' + resp);
    this.con = this.con.filter(contact => contact.id !== id);
     });
    }


    editContact(contact: Contact) {
      this._auth.UpdateContact(contact).subscribe(resp => {
        console.log('record updated' + resp);
      });
    }


  //  this.con = this.con.filter(contact => contact.id !== id)
    private handleError(error: any): Promise<any> {
      console.error('Some error occured', error);
      return Promise.reject(error.message || error);
    }
  }




  // createTodo(todoForm: NgForm): void {
  //   this.todoService.createTodo(this.newTodo)
  //     .then(createTodo => {
  //       todoForm.reset();
  //       this.newTodo = new Todo();
  //       this.todos.unshift(createTodo)
  //     });
  // }

  // createTodo(todoData: Todo): Promise<Todo> {
  //   return this.http.post(this.baseUrl + '/api/todos/', todoData)
  //     .toPromise().then(response => response.json() as Todo)
  //     .catch(this.handleError);
