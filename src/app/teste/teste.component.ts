import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartQuestions
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
    values = [2433, 1041, 466, 111, 13]

    var chartOrders = document.getElementById('chart-orders');
    var chartOrders1 = document.getElementById('chart-orders1');
    var chartOrders2 = document.getElementById('chart-orders2');
    var chartOrders3 = document.getElementById('chart-orders3');
    var chartOrders4 = document.getElementById('chart-orders4');
    var chartOrders5 = document.getElementById('chart-orders5');

    parseOptions(Chart, chartOptions());

    this.ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartQuestions.options,
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

    this.ordersChart = new Chart(chartOrders1, {
      type: 'bar',
      options: chartQuestions.options,
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

    this.ordersChart = new Chart(chartOrders2, {
      type: 'bar',
      options: chartQuestions.options,
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

    this.ordersChart = new Chart(chartOrders3, {
      type: 'bar',
      options: chartQuestions.options,
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

    this.ordersChart = new Chart(chartOrders4, {
      type: 'bar',
      options: chartQuestions.options,
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

    this.ordersChart = new Chart(chartOrders5, {
      type: 'bar',
      options: chartQuestions.options,
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
}
