import { AnswerService } from './../../services/answer.service';
import { AnswersByQuest } from './../../models/AnswersByQuest';
import { InterviewsCount } from './../../models/InterviewsCount';
import { InterviewService } from './../../services/interview.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { chartOptions, parseOptions, chartQuestions } from "../../variables/charts";
import Chart from 'chart.js';

export interface DataChart {
  id: Number;
  label: string;
  values: number[];
}

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css']
})
export class TesteComponent implements OnInit {
  @ViewChild('sortCity', { static: true }) private sortCity: MatSort;
  @ViewChild('sortUser', { static: true }) private sortUser: MatSort;

  private displayedColumnsCity: string[] = ['name', 'count'];
  private displayedColumnsUser: string[] = ['name', 'count'];

  private dataSourceCity: MatTableDataSource<InterviewsCount>;
  private dataSourceUser: MatTableDataSource<InterviewsCount>;

  private dataCharts: DataChart[] = []
  private ordersChart = [];

  constructor(private interviewService: InterviewService, private answerService: AnswerService) {
    parseOptions(Chart, chartOptions());
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loadMatTables().then(
      () => {
        this.dataSourceCity.sort = this.sortCity;
        this.dataSourceUser.sort = this.sortUser;
      },
      err => {
        console.log(err);
      }
    );

    this.getDataChart(1).then(
      () => {
        this.loadCharts()
      },
      err => {
        console.log(err);
      }
    )
  }

  async loadMatTables() {
    const dataCity = await this.interviewService.groupByCity().toPromise();
    const dataUser = await this.interviewService.groupByUser().toPromise();

    this.dataSourceCity = new MatTableDataSource(dataCity);
    this.dataSourceUser = new MatTableDataSource(dataUser);
  }

  async loadCharts() {
    var chartOrders: HTMLElement;

    setTimeout(() => {
      for (var i = 0; i < this.dataCharts.length; i++) {
        chartOrders = document.getElementById('chart-order-' + this.dataCharts[i].id.toString());

        this.ordersChart.push(new Chart(chartOrders, {
          type: 'bar',
          options: chartQuestions.options,
          data: {
            labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
            datasets: [
              {
                label: this.dataCharts[i].label,
                data: this.dataCharts[i].values
              }
            ]
          }
        }))
      }
    }, 300);
  }

  async getDataChart(searchId) {
    const answersByQuest: AnswersByQuest[] = await this.answerService.countAnswersByQuest(searchId).toPromise();

    for (var i = 0; i < answersByQuest.length; i++) {
      this.dataCharts.push({
        id: answersByQuest[i].quest_id,
        label: "Questão " + (i + 1),
        values: [0, 0, 0, 0, 0]
      })

      answersByQuest[i].rates.forEach(element => {
        this.dataCharts[i].values[4 - (element.rate - 1)] = parseInt(element.count);
      });
    }
  }
}


