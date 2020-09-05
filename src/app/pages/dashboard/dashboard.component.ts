import { UserService } from './../../services/user.service';
import { User } from './../../models/User';
import { SearchQuestService } from './../../services/searchQuest.service';
import { CountRates } from 'app/models/CountRates';
import { City } from './../../models/City';
import { CityService } from './../../services/city.service';
import { GlobalFunctions } from './../../global';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { InterviewsCount } from './../../models/InterviewsCount';
import { MatTableDataSource } from '@angular/material/table';
import Chart from 'chart.js';
import { AnswerService } from './../../services/answer.service';
import { InterviewService } from './../../services/interview.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { chartOptions, parseOptions, chartQuestions } from "../../variables/charts";
import { DateAdapter } from '@angular/material/core';

interface InfoMatTable {
  nameTitle: string;
  countTitle: string
  displayedColumns: [string, string];
  dataSource: MatTableDataSource<InterviewsCount>;
  data: InterviewsCount[];
  loading: boolean;
  total: number;
}

interface InfoChart {
  quest_id: Number;
  question: String;
  label: String;
  data: number[];
  chart: Chart;
  iscQuest: number;
}

interface DataMatTable {
  search_id: Number;
  type: String;
  matTableCity: InfoMatTable;
  matTableUser: InfoMatTable;
  filters: {
    beginDate: Date;
    endDate: Date;
    user: User;
  }
}

interface DataChart {
  search_id: Number;
  type: String;
  iscGeneral: number;
  infoCharts: InfoChart[];
  filters: {
    beginDate: Date;
    endDate: Date;
    city: City;
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  private searchesMatTable: DataMatTable[] = [];
  private searchesChart: DataChart[] = [];

  private users: User[] = [];
  private searches: Search[] = [];
  private cities: City[] = [];

  private chartLoading: Boolean = true;
  private matTableLoading: Boolean = true;

  constructor(
    private globalFunc: GlobalFunctions,
    private interviewService: InterviewService,
    private answerService: AnswerService,
    private userService: UserService,
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
    await this.refresUsers().then(users => {
      this.users = users.sort(function (a, b) {
        if (a.name > b.name)
          return 1;

        if (a.name < b.name)
          return -1;

        return 0
      });
    }).catch(err => {
      console.log(err);

      this.globalFunc.showNotification("Não foi possível carregar os usuários", 2);
    });

    await this.refreshCities().then(cities => {
      this.cities = cities;
    }).catch(err => {
      console.log(err);

      this.globalFunc.showNotification("Não foi possível carregar as cidades", 2);
    });

    await this.refreshSearches().then(searches => {
      this.searches = searches;

      this.refreshDataMatTable();
      this.refreshDataChart();
    }).catch(err => {
      console.log(err);

      this.globalFunc.showNotification("Não foi possível carregar as pesquisas", 2);
    });
  }

  async refreshDataMatTable() {
    if (this.searchesMatTable.length == 0)
      this.searches.forEach(search => {
        this.initializeMatTables(search);
      });

    setTimeout(() => {
      this.searchesMatTable.forEach(searchMatTable => {
        this.updateMatTable(searchMatTable, "");
      })
    }, 300);

    this.matTableLoading = false;
  }

  async refresUsers() {
    return await this.userService.get('searcher=1').toPromise();
  }

  async refreshCities() {
    return await this.cityService.get('active=1').toPromise();
  }

  async refreshSearches() {
    return await this.searchService.get('acive=1').toPromise();
  }

  async refreshDataChart() {
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

  initializeMatTables(search: Search) {
    const matTable: DataMatTable = {
      search_id: search.id,
      type: search.type,
      matTableCity: {
        nameTitle: 'Cidade',
        countTitle: 'N° Pesquisas',
        displayedColumns: ['name', 'count'],
        data: [],
        dataSource: null,
        total: 0,
        loading: true
      },
      matTableUser: {
        nameTitle: 'Operador CRM',
        countTitle: 'N° Pesquisas',
        displayedColumns: ['name', 'count'],
        data: [],
        dataSource: null,
        total: 0,
        loading: true
      },
      filters: {
        beginDate: null,
        endDate: null,
        user: null
      }
    }

    this.searchesMatTable.push(matTable);
  }

  updateMatTable(searchMatTable: DataMatTable, params: string) {
    const search_id = searchMatTable.search_id;
    const urlParams: string = params ? `search=${search_id}&${params}` : `search=${search_id}`;

    this.interviewService.groupByUser(urlParams).subscribe(
      dataUser => {
        searchMatTable.matTableUser.data = dataUser;
        searchMatTable.matTableUser.dataSource = new MatTableDataSource(dataUser);

        searchMatTable.matTableUser.total = searchMatTable.matTableUser.data
          .map(c => c.count).reduce((acc, value: any) => acc + value, 0);

        searchMatTable.matTableUser.loading = false
      },
      err => {
        console.log(err);

        searchMatTable.matTableUser.loading = false
        this.globalFunc.showNotification("Não foi possível carregar o número de pesquisas por cidade", 2);
      }
    );

    this.interviewService.groupByCity(urlParams).subscribe(
      dataCity => {
        searchMatTable.matTableCity.data = dataCity;
        searchMatTable.matTableCity.dataSource = new MatTableDataSource(dataCity);

        searchMatTable.matTableCity.total = searchMatTable.matTableCity.data
          .map(c => c.count).reduce((acc, value: any) => acc + value, 0);

        searchMatTable.matTableCity.loading = false
      },
      err => {
        console.log(err)

        searchMatTable.matTableCity.loading = false
        this.globalFunc.showNotification("Não foi possível carregar o número de pesquisas por operador", 2);
      }
    );

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

  filterChart(searchChart: DataChart) {
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

  filterMatTable(searchMatTable: DataMatTable) {
    const toDate = this.globalFunc.dateConverter;
    var params: string = "";

    if (searchMatTable.filters.user)
      params += "user=" + searchMatTable.filters.user.id + "&";

    if (searchMatTable.filters.beginDate)
      params += "begin=" + toDate(searchMatTable.filters.beginDate) + "&";

    if (searchMatTable.filters.endDate)
      params += "end=" + toDate(searchMatTable.filters.endDate) + "&";

    if (params)
      params = params.slice(0, -1);

    this.updateMatTable(searchMatTable, params);
  }
}
