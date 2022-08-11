import { Component, OnInit, OnDestroy } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html'
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[]= [];
  public cargando: boolean = true;

  public imgSubs!: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay (100))
    .subscribe(() => { this.cargarMedicos() });

  }

  buscar(termino: string) {

    if(termino.length === 0) {
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos', termino)
                        .subscribe(resultados => {
                          this.medicos = resultados as Medico[];
                        })
  }


  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
                      .subscribe(medicos =>{
                        this.cargando = false;
                        this.medicos = medicos;
                        console.log(medicos)
                      })
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  borrarMedico(medico: Medico) {
    // this.medicoService.borrarMedico(medico._id!)
    //                     .subscribe(resp => {
    //                       this.cargarMedicos();
    //                       Swal.fire('Borrado', medico.nombre, 'success')
    //                     });
    Swal.fire({
      title: 'Borrar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar!'
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico._id!)
                            .subscribe(resp => {
                              this.cargarMedicos();
                              Swal.fire('Médico borrado', `${medico.nombre} fue eliminado correctamente`, 'success');
                            })

      }
    })
  }

}
