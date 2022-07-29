import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then(usuario => {
      console.log(usuario);
    })
  }

  //      EJEMPLO DE PROMESA SIMPLE

  //   const promesa = new Promise((resolve, reject) => {
  //     if(true) {
  //       resolve("Hola Mundo");
  //     } else {
  //       reject('Algo salió mal');
  //     }

  //   });
  //   promesa.then((mensaje) => {
  //     console.log(mensaje);
  //   }).catch(error => console.log("Error en mi promesa", error));
  //   console.log("Fin del Init");
  //

  getUsuarios() {

    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data))
    });

  }

}
