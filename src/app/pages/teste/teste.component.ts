import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Chart from 'chart.js';
import { HttpClient } from '@angular/common/http';

import {
  chartOptions,
  parseOptions,
  chartQuestions
} from "../../variables/charts";

export interface TableSearches {
  name: string;
  qtdInterviews: number;
}

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {
  @ViewChild('sortUS', { static: true }) sortUS: MatSort;
  @ViewChild('sortCS', { static: true }) sortCS: MatSort;

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  private http: HttpClient;
  private ordersChart;

  userSearches: TableSearches[] = [
    { name: "Flavia Sousa", qtdInterviews: 596 },
    { name: "Adriano de Castro", qtdInterviews: 474 },
    { name: "Maria Eduarda", qtdInterviews: 660 },
    { name: "Laura Rosa", qtdInterviews: 453 },
    { name: "Cassiane Alves", qtdInterviews: 581 }
  ]

  citySearches: TableSearches[] = [
    { name: 'Guimarânia', qtdInterviews: 107 },
    { name: 'Patos de Minas', qtdInterviews: 1146 },
    { name: 'Varjão de Minas', qtdInterviews: 53 },
    { name: 'Patrocínio', qtdInterviews: 1263 },
    { name: 'Iraí de Minas', qtdInterviews: 115 },
    { name: 'Abadia dos Dourados', qtdInterviews: 85 }
  ]

  displayedColumnsUS: string[] = ['name', 'qtdInterviews'];
  dataSourceUS = new MatTableDataSource(this.userSearches);

  displayedColumnsCS: string[] = ['name', 'qtdInterviews']
  dataSourceCS = new MatTableDataSource(this.citySearches);

  constructor() { }

  ngOnInit(): void {
    this.dataSourceUS.sort = this.sortUS;
    this.dataSourceCS.sort = this.sortCS;

    this.refreshChart([])
  }

  teste() {
    this.http.get('http://127.0.0.1:3333/user').subscribe(suc => {
      console.log(suc);
    },
      err => {
        console.log(err);
      })
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
        labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
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
        labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
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
        labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
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
        labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
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
        labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
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
        labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
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