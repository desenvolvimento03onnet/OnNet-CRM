import { SearchQuestService } from './../../services/searchQuest.service';
import { CountRates } from 'app/models/CountRates';
import { City } from './../../models/City';
import { CityService } from './../../services/city.service';
import { GlobalFunctions } from './../../global';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { MatSort } from '@angular/material/sort';
import { InterviewsCount } from './../../models/InterviewsCount';
import { MatTableDataSource } from '@angular/material/table';
import Chart from 'chart.js';
import { AnswerService } from './../../services/answer.service';
import { InterviewService } from './../../services/interview.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { chartOptions, parseOptions, chartQuestions } from "../../variables/charts";
import { DateAdapter } from '@angular/material/core';

interface DataChart {
  search_id: Number;
  type: String;
  iscGeneral: number;
  infoCharts: Array<{
    quest_id: Number;
    question: String;
    label: String;
    data: number[];
    chart: Chart;
    iscQuest: number;
  }>;
  filters: {
    city: City;
    beginDate: Date;
    endDate: Date;
  }
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

  private matCityLoading: Boolean = true;
  private matUserLoading: Boolean = true;

  private searchesChart: DataChart[] = [];

  private searches: Search[] = [];
  private cities: City[] = [];

  private chartLoading: Boolean = true;
  private totalInterviews: Number = 0;

  private beginDate: Date = null;
  private endDate: Date = null;
  private citySelected: City

  constructor(
    private globalFunc: GlobalFunctions,
    private interviewService: InterviewService,
    private answerService: AnswerService,
    private searchService: SearchService,
    private searchQuestService: SearchQuestService,
    private cityService: CityService,
    private adapter: DateAdapter<any>
  ) {
    parseOptions(Chart, chartOptions());
  }

  ngOnInit(): void {
    this.adapter.setLocale('pt');

    this.refresh();
  }

  async refresh() {
    this.refreshMatTables()

    this.refreshDataChart()
  }

  async refreshMatTables() {
    this.interviewService.groupByUser('active=1').subscribe(
      dataUser => {
        this.dataSourceUser = new MatTableDataSource(dataUser);
        this.dataSourceUser.sort = this.sortUser;

        this.matUserLoading = false;
      },
      err => {
        console.log(err)
        this.globalFunc.showNotification("Não foi possível carregar o número de pesquisas por cidade", 2);
      }
    );


    this.interviewService.groupByCity('active=1').subscribe(
      dataCity => {
        this.totalInterviews = dataCity.map(c => c.count).reduce((acc, value: any) => acc + value, 0);

        this.dataSourceCity = new MatTableDataSource(dataCity);
        this.dataSourceCity.sort = this.sortCity;

        this.matCityLoading = false;
      },
      err => {
        console.log(err)
        this.globalFunc.showNotification("Não foi possível carregar o número de pesquisas por operador", 2);
      }
    );
  }

  async refreshCities() {
    this.cities = await this.cityService.get('active=1').toPromise();
  }

  async refreshSearches() {
    this.searches = await this.searchService.get('active=1').toPromise();
  }

  async refreshDataChart() {
    await this.refreshCities().catch(err => {
      console.log(err);

      this.globalFunc.showNotification("Não foi possível carregar as cidades", 2);
    });

    await this.refreshSearches().catch(err => {
      console.log(err);

      this.globalFunc.showNotification("Não foi possível carregar as pesquisas", 2);
    });

    if (this.searchesChart.length == 0)
      this.searches.forEach(search => {
        this.inicializeCharts(search);
      });

    setTimeout(() => {
      this.searchesChart.forEach(searchChart => {
        this.updateCharts(searchChart, "");
      })
    }, 300);

    this.chartLoading = false;
  }

  async inicializeCharts(search: Search) {
    const searchQuests = await this.searchQuestService.getBySearch(search.id).toPromise();

    const searchChart: DataChart = {
      search_id: search.id,
      type: search.type,
      iscGeneral: 0,
      infoCharts: [],
      filters: {
        city: null,
        beginDate: null,
        endDate: null
      }
    }

    for (var i = 0; i < searchQuests.length; i++) {
      const label: string = "Questão " + (i + 1);
      const data: number[] = [0, 0, 0, 0, 0];

      searchChart.infoCharts.push({
        quest_id: searchQuests[i].quest_id,
        question: searchQuests[i].quest.question,
        label: label,
        data: data,
        chart: null,
        iscQuest: 0
      })
    }

    this.searchesChart.push(searchChart);
  }

  updateCharts(searchChart: DataChart, params: String) {
    searchChart.infoCharts.forEach(quest => {
      const weight: number[] = [0, 0, 20, 80, 100];
      var isc: number = 0;
      var sum: number = 0;

      searchChart.iscGeneral = 0;

      this.answerService.countRates(searchChart.search_id, quest.quest_id, params).subscribe(
        suc => {
          const countRates: CountRates[] = suc;

          quest.data = [0, 0, 0, 0, 0];
          quest.iscQuest = 0;

          countRates.forEach(rate => {
            quest.data[rate.rate - 1] = parseInt(rate.count);
          });

          if (quest.chart == null) {
            const chartOrder: any = document.getElementById(
              'search' + searchChart.search_id + '-quest' + quest.quest_id
            );

            quest.chart = new Chart(chartOrder, {
              type: 'bar',
              options: chartQuestions.options,
              data: {
                labels: ["Nota 1", "Nota 2", "Nota 3", "Nota 4", "Nota 5"],
                datasets: [
                  {
                    label: quest.label,
                    data: quest.data
                  }
                ]
              }
            })
          }
          else {
            quest.chart.data.datasets[0].data = quest.data;
            quest.chart.update();
          }

          for (var i = 0; i < 5; i++) {
            isc += weight[i] * quest.data[i];
            sum += quest.data[i];
          }

          quest.iscQuest = sum != 0 ? ((isc / (sum * 100)) * 10) : 0;
          searchChart.iscGeneral += quest.iscQuest;
        },
        err => {
          console.log(err);

          this.globalFunc.showNotification("Não foi possível atualizar a questão " + quest.label, 2);
        }
      );
    });
  }

  calcIscGeneral(searchChart: DataChart) {
    return searchChart.infoCharts.length > 0 ? searchChart.iscGeneral / searchChart.infoCharts.length : 0;
  }

  filterSearch(searchChart: DataChart) {
    const toDate = this.globalFunc.dateConverter;
    var params: String = "";

    if (searchChart.filters.city)
      params += "city=" + searchChart.filters.city.id + "&";

    if (searchChart.filters.beginDate)
      params += "begin=" + toDate(searchChart.filters.beginDate) + "&";

    if (searchChart.filters.endDate)
      params += "end=" + toDate(searchChart.filters.endDate) + "&";

    if (params)
      params = params.slice(0, -1);

    this.updateCharts(searchChart, params);
  }
}
