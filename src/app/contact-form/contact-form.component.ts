import { Contact } from './../../model/contact';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup ,  ReactiveFormsModule } from '@angular/forms';
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
  editing = false;
  AddEditButtton: String = 'ADD';
  id: string;
  UpdateAdded : string;
  constructor( private _auth: AuthService, private _http: HttpClient, private _form: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.Flag = false;
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
        name: '',
        phoneno: '',
        country: '',
        id: ''
      });
    }
      contactForm() {
        this.ShowAllFlag = true;
        this.UpdateAdded = 'added';
        this.Flag = false;
        if (!this.editing) {
       this._auth.insertRecord(this.form.value).subscribe(resp => {
         console.log('record Insreted' + JSON.stringify(resp));
         console.log(this.con);
         this.contact = resp;
         this.form.reset();
       });
      } else {
         console.log(this.form.value);
        // this.contact.name = this.form.value.name;
         //this.contact.phoneno = this.form.value.phoneno;
         //this.contact.country = this.form.value.country;
     //    this.contact.id = this.id;

         this.updateContact(this.form.value);
         this.editing = false;
         this.AddEditButtton = 'Add';
       }
     //  this.getAll();
      }
      deleteContact(id: string) {
     this._auth.deleteRecord(id).subscribe(resp => {
    console.log('contact deleted' + resp);
    this.con = this.con.filter(contact => contact.id !== id);
     });
    }


    updateContact(contact: Contact) {
     // console.log(contact.id);
      this._auth.UpdateContact(contact).subscribe(resp => {
        console.log('record updated' + resp);
        this.contact = resp;
      });
      this.UpdateAdded = 'updated';
      this.Flag = false;
      this.form.reset();
    }



    editContact(contact: Contact) {
      this.editing = true;
      this.AddEditButtton = 'Edit';
      this.form.patchValue(
        {name : contact.name,
        phoneno: contact.phoneno,
        country : contact.country,
        id : contact.id
      }
      );
     // this.id = contact.id;
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
