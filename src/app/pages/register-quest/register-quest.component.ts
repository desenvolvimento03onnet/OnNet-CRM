import { GlobalFunctions } from './../../global';
import { InterviewService } from './../../services/interview.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalInfoInterviewComponent } from './../../modal/modal-info-interview/modal-info-interview.component';
import { AnswerService } from './../../services/answer.service';
import { Interview } from './../../models/Interview';
import { Quest } from './../../models/Quest';
import { Search } from './../../models/Search';
import { SearchService } from './../../services/search.service';
import { Component, OnInit } from '@angular/core';

interface AnswerQuests {
  search: Search;
  quests: {
    quest: Quest;
    page: number;
    lastPage: number;
    loading: boolean;
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
    private interviewService: InterviewService,
    private functions: GlobalFunctions,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    const searches: Search[] = await this.searchService.get("active").toPromise();
    var answerQuest: AnswerQuests = null;

    this.answerQuests = [];

    searches.forEach(search => {
      answerQuest = {
        search: search,
        quests: []
      }

      search.quests.forEach(quest => {
        answerQuest.quests.push({
          quest: search.quests[search.quests.indexOf(quest)],
          page: null,
          lastPage: null,
          loading: false,
          answers: []
        })
      })

      this.answerQuests.push(answerQuest);
    })
  }

  async loadAnswers(answerQuest: AnswerQuests, quest: any) {
    const index = answerQuest.quests.indexOf(quest)

    if (answerQuest.quests[index].page == null) {
      answerQuest.quests[index].loading = true;

      this.answerService.getNotes(answerQuest.search.id, quest.quest.id).subscribe(
        paginate => {
          answerQuest.quests[index].page = paginate.page;
          answerQuest.quests[index].lastPage = paginate.lastPage;
          answerQuest.quests[index].answers = paginate.data;

          answerQuest.quests[index].loading = false;
        },
        err => {
          answerQuest.quests[index].loading = false;

          this.functions.showNotification("Ocorreu um erro ao carregar as respostas", 3);

          console.log(err);
        }
      );
    }
  }

  nextPage(answerQuest: AnswerQuests, quest: any) {
    const index = answerQuest.quests.indexOf(quest)

    answerQuest.quests[index].loading = true;

    this.answerService.getNotes(answerQuest.search.id, quest.quest.id, quest.page + 1).subscribe(
      paginate => {
        answerQuest.quests[index].page = paginate.page;
        answerQuest.quests[index].lastPage = paginate.lastPage;
        answerQuest.quests[index].answers = answerQuest.quests[index].answers.concat(paginate.data);

        answerQuest.quests[index].loading = false;
      },
      err => {
        answerQuest.quests[index].loading = false;

        this.functions.showNotification("Ocorreu um erro ao carregar as respostas", 3);

        console.log(err);
      }
    );
  }

  async showMore(interview_id: Number) {
    const interview: Interview = await this.interviewService.getById(interview_id).toPromise();

    this.dialog.open(ModalInfoInterviewComponent, {
      width: "1000px",
      height: "600px",
      data: interview
    });
  }
}
