import { Component } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {
  public labels1: string[] = ['Pan', 'Cola', 'Arroz'];
  public data1 = [
    "doughnut",
    [10, 15, 40],
    null
  ];
}
