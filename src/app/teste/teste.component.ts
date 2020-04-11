import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../variables/charts";

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  ordersChart;

  constructor() { }

  ngOnInit(): void {
    this.refreshChart([])
  }

  refreshChart(values) {
    // values = [3, 4, 5, 8, 1]

    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());

    this.ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: {
        labels: ["5", "4", "3", "2", "1"],
        datasets: [
          {
            label: "Notas",
            data: values
          }
        ]
      }
    });
  }

  update(a) {
    const teste: any = document.getElementById('arr');
    var value = [];

    for (var i = 0; i < 5; i++) {
      console.log(teste.value[i])

      value.push(teste.value[i] + 0)
    }

    this.refreshChart(value);
  }
}
