import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
  user: UserModel = new UserModel();
  recallUser = false;

  constructor( private auth: AuthService,
                private router: Router) { }

  ngOnInit() { 
    this.user = new UserModel();
  }

  onSubmit( form: NgForm ){

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    if ( form.invalid ) { return; }
    this.auth.newUser( this.user )
      .subscribe( resp => {
        console.log( resp );
        Swal.close();
        if  ( this.recallUser ){
          localStorage.setItem('email', this.user.email);
        }
        this.router.navigateByUrl('/home');
      }, (err) => {
        console.log(err.error.error.message);
        Swal.fire({
          type: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      });
  }


}
