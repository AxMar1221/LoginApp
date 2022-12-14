import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.models';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  recallUser = false;

  constructor( private auth: AuthService,
                private router: Router) { }


  ngOnInit() { 
    if  ( localStorage.getItem('email') ){
      this.user.email = localStorage.getItem('email');
      this.recallUser = true;
    }
  }

  login( form: NgForm ){

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor'
    });
    Swal.showLoading();

    this.auth.login( this.user )
    .subscribe( resp => {
      console.log( resp );
      Swal.close();
      if  ( this.recallUser ){
        localStorage.setItem('email', this.user.email);
      }
      this.router.navigateByUrl('/home');
    }, ( err ) => {
      console.log( err.error.error.message );
      Swal.fire({
        type: 'error',
        title: 'Error al autenticar',
        text: err.error.error.message
      });
    })

  }

}
