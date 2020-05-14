import { City } from './../../models/City';
import { SearchQuestService } from './../../services/searchQuest.service';
import { AnswerService } from './../../services/answer.service';
import { InterviewService } from './../../services/interview.service';
import { Quest } from './../../models/Quest';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface interviewData {
  greeting: String;
  user: String;
  interview: {
    client_name: String;
    city: City;
    search_id: Number;
  }
}

interface AnswerBody {
  quest: Quest;
  rate: Number;
  note: String;
}

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.css']
})
export class ModalSearchComponent implements OnInit {
  private answerBody: AnswerBody[] = [];
  private quests: Quest[] = [];
  private note: String = '';
  private index: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: interviewData,
    private answerService: AnswerService,
    private interviewService: InterviewService,
    private searchQuestService: SearchQuestService,
    private dialogRef: MatDialogRef<ModalSearchComponent>
  ) { }

  ngOnInit(): void {
    this.getQuests()
  }

  close() {
    this.dialogRef.close()
  }

  getQuests() {
    this.searchQuestService.getBySearch(this.data.interview.search_id, 'active=1').subscribe(
      searchQuests => {
        searchQuests.forEach(searchQuest => {
          this.answerBody.push({
            quest: searchQuest.quest,
            rate: null,
            note: ''
          })
        })

        console.log(searchQuests)
      },
      err => {
        console.log(err)
      }
    )
  }

  setLabel(index: number) {
    if (this.answerBody[index].rate)
      return `Nota ${this.answerBody[index].rate}`

    else
      return `Pergunta`
  }

  setRate(rate: Number, answer: AnswerBody) {
    this.answerBody[this.answerBody.indexOf(answer)].rate = rate;
  }

  backIndex() {
    this.index--;
  }

  nextIndex() {
    this.index++;
  }

  submit() {
    const interviewBody = {
      client_name: this.data.interview.client_name,
      search_id: this.data.interview.search_id,
      city_id: this.data.interview.city.id
    }

    this.interviewService.post(interviewBody).subscribe(
      interview => {
        this.putAnswers(interview.id);

        this.dialogRef.close();
      },
      err => {
        console.log(err);
      }
    )
  }

  putAnswers(id: Number) {
    this.answerBody.forEach(answer => {
      this.answerService.get('interview=' + id, 'quest=' + answer.quest.id)
        .subscribe(
          suc => {
            this.answerService.put(suc[0].id, { rate: answer.rate, note: answer.note }).subscribe(
              suc => {
                console.log(suc);
              },
              err => {
                console.log(err);
              }
            )
          },
          err => {
            console.log(err)
          }
        )
    })
  }
}
