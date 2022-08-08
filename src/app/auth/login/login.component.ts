import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { LoginForm } from '../../interfaces/login-form.interface';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements AfterViewInit{

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public loginForm: any = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required ],
    remember: [false],
  });

  constructor(private router : Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService) { }
  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '188028786468-a7aofqpk56b5fmoeehvvrp442cmfkroo.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse (response: any) {
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
    .subscribe( resp => {
      console.log({login: resp})
    } )
  }


  login() {

    this.usuarioService.login(this.loginForm.value)
    .subscribe(resp => {
      if(this.loginForm.get('remember').value ){
        localStorage.setItem('email', this.loginForm.get('email').value);
      } else {
        localStorage.removeItem('email');
      }

      //Navegar al Dashboard
      this.router.navigateByUrl('/');

    }, (err) => {
      Swal.fire('Error', err.error.msg, 'error');
    })

    //console.log(this.loginForm.value)
  }

}
