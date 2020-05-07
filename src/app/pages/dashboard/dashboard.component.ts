import { GlobalFunctions } from './../../global';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { MatSort } from '@angular/material/sort';
import { InterviewsCount } from './../../models/InterviewsCount';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import { AnswerService } from './../../services/answer.service';
import { InterviewService } from './../../services/interview.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { chartOptions, parseOptions, chartQuestions } from "../../variables/charts";

interface AnswersByQuest {
  quest_id: Number;
  question: String;
  rates: {
    rate: number;
    count: string;
  }[];
}

interface SearchChart {
  id: Number;
  name: String;
  data: DataChart[];
}

interface DataChart {
  id: Number;
  quest: String;
  label: string;
  values: number[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  @ViewChild('sortCity', { static: true }) private sortCity: MatSort;
  @ViewChild('sortUser', { static: true }) private sortUser: MatSort;

  private displayedColumnsCity: string[] = ['name', 'count'];
  private displayedColumnsUser: string[] = ['name', 'count'];

  private dataSourceCity: MatTableDataSource<InterviewsCount>;
  private dataSourceUser: MatTableDataSource<InterviewsCount>;

  private searchDataCharts: SearchChart[] = [];

  private chartLoading = true;
  private matCityLoading = true;
  private matUserLoading = true;

  constructor(
    private globalFunc: GlobalFunctions,
    private interviewService: InterviewService,
    private answerService: AnswerService,
    private searchService: SearchService) {

    parseOptions(Chart, chartOptions());
  }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    this.refreshMatTables().then(() => {
      this.matCityLoading = false;
      this.matUserLoading = false;
    });

    this.refreshDataChart().then(() => {
      this.chartLoading = false;
    })
  }

  async refreshDataChart() {
    await this.loadDataChart();
    this.loadCharts();
  }

  async refreshMatTables() {
    await this.loadMatTables();

    this.dataSourceCity.sort = this.sortCity;
    this.dataSourceUser.sort = this.sortUser;
  }

  async loadMatTables() {
    const dataUser = await this.interviewService.groupByUser().toPromise();
    const dataCity = await this.interviewService.groupByCity().toPromise();

    this.dataSourceUser = new MatTableDataSource(dataUser);
    this.dataSourceCity = new MatTableDataSource(dataCity);
  }

  async loadDataChart() {
    const searches: Search[] = await this.searchService.get().toPromise();

    searches.forEach(element => {
      this.getDataChart(element.id).then(
        suc => {
          this.searchDataCharts.push({
            id: element.id,
            name: element.type,
            data: suc
          })
        },
        err => {
          console.log(err);
        }
      )
    })
  }

  async loadCharts() {
    var chartOrders: HTMLElement;
    var ordersChart: Chart;

    setTimeout(() => {
      this.searchDataCharts.forEach(search => {
        search.data.forEach(quest => {
          chartOrders = document.getElementById('search' + search.id + '-quest' + quest.id);

          ordersChart = new Chart(chartOrders, {
            type: 'bar',
            options: chartQuestions.options,
            data: {
              labels: ["Nota 5", "Nota 4", "Nota 3", "Nota 2", "Nota 1"],
              datasets: [
                {
                  label: quest.label,
                  data: quest.values
                }
              ]
            }
          })
        })
      });
    }, 300);
  }

  async getDataChart(searchId: Number) {

    let params: string[] = [];

    const answersByQuest: AnswersByQuest[] = await this.answerService.countAnswersByQuest(searchId).toPromise();

    let dataCharts: DataChart[] = [];

    for (var i = 0; i < answersByQuest.length; i++) {
      dataCharts.push({
        id: answersByQuest[i].quest_id,
        quest: answersByQuest[i].question,
        label: "Questão " + (i + 1),
        values: [0, 0, 0, 0, 0]
      })

      answersByQuest[i].rates.forEach(element => {
        dataCharts[i].values[4 - (element.rate - 1)] = parseInt(element.count);
      });
    }

    return dataCharts;
  }

}
