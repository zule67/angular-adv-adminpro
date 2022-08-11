import Swal from 'sweetalert2';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html'
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService
              ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay (100))
    .subscribe(() => { this.cargarHospitales() });
  }

  buscar(termino: string) {

    if(termino.length === 0) {
      return this.cargarHospitales();
    }

    this.busquedaService.buscar('hospitales', termino)
                        .subscribe(resultados => {
                          this.hospitales = resultados as Hospital[];
                        })
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales()
                        .subscribe(hospitales => {
                          this.cargando= false;
                          this.hospitales= hospitales ;
                        });
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre)
                        .subscribe(resp => {
                          Swal.fire('Actualizado', hospital.nombre, 'success')
                        });
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id!)
                        .subscribe(resp => {
                          this.cargarHospitales();
                          Swal.fire('Borrado', hospital.nombre, 'success')
                        });
  }

  async abrirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del nuevo hospital',
      showCancelButton: true,
    })

    if( value!.trim().length > 0 ) {
      this.hospitalService.crearHospital(value!)
                          .subscribe( (resp: any) => {
                            this.hospitales.push(resp.hospital)
                          })
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }
}
