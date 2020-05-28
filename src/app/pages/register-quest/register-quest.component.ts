import { Answer } from './../../models/Answer';
import { SearchQuest } from './../../models/SearchQuest';
import { AnswerService } from './../../services/answer.service';
import { SearchQuestService } from './../../services/searchQuest.service';
import { Interview } from './../../models/Interview';
import { Quest } from './../../models/Quest';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { Component, OnInit } from '@angular/core';

interface Paginate {
  total: Number;
  perPage: Number;
  page: number;
  lastPage: number;
  data: Answer[];
}

interface AnswerQuests {
  search: Search;
  quests: {
    quest: Quest;
    page: number;
    lastPage: number;
    answers: {
      interview: Interview;
      rate: Number;
      note: String;
    }[];
  }[];
}

@Component({
  selector: 'app-register-quest',
  templateUrl: './register-quest.component.html',
  styleUrls: ['./register-quest.component.css']
})
export class RegisterQuestComponent implements OnInit {

  private answerQuests: AnswerQuests[] = [];

  constructor(
    private searchService: SearchService,
    private answerService: AnswerService,
    private searchQuestService: SearchQuestService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    const searches: Search[] = await this.searchService.get("active").toPromise();
    var answerQuest: AnswerQuests = null;

    this.answerQuests = [];

    for (var i = 0; i < searches.length; i++) {
      const searchQuests: SearchQuest[] = await this.searchQuestService.getBySearch(searches[i].id).toPromise();

      this.answerQuests.push({
        search: searches[i],
        quests: []
      });

      for (var j = 0; j < searchQuests.length; j++) {
        const paginate: Paginate = await this.answerService.getNotes(searches[i].id, searchQuests[j].id).toPromise();

        this.answerQuests[i].quests.push({
          quest: searchQuests[j].quest,
          page: paginate.page,
          lastPage: paginate.lastPage,
          answers: paginate.data
        })
      }
    }

    console.log(this.answerQuests)
  }

}
