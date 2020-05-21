import { Search } from './../../models/Search';
import { FileSaverModule, FileSaverService } from 'ngx-filesaver';
import { Interview } from './../../models/Interview';
import { Answer } from './../../models/Answer';
import { GlobalFunctions } from './../../global';
import { ModalConfirmComponent } from './../../modal/modal-confirm/modal-confirm.component';
import { City } from '../../models/City';
import { SearchQuestService } from '../../services/searchQuest.service';
import { AnswerService } from '../../services/answer.service';
import { InterviewService } from '../../services/interview.service';
import { Quest } from '../../models/Quest';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

interface InterviewData {
  search_type: String,
  greeting: String;
  user: String;
  interview: {
    client_name: String;
    city: City;
    search_id: Number;
  }
}

interface InterviewBody {
  client_name: String;
  search_id: Number;
  city_id: Number;
  interview_date: String;
}

interface AnswerBody {
  quest: Quest;
  rate: Number;
  note: String;
}

@Component({
  selector: 'app-modal-interview',
  templateUrl: './modal-interview.component.html',
  styleUrls: ['./modal-interview.component.css']
})
export class ModalSearchComponent implements OnInit {
  private answerBody: AnswerBody[] = [];
  private quests: Quest[] = [];
  private note: String = '';
  private index: number = 0;
  private showButtons: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: InterviewData,
    private answerService: AnswerService,
    private interviewService: InterviewService,
    private searchQuestService: SearchQuestService,
    private dialogRef: MatDialogRef<ModalSearchComponent>,
    private functions: GlobalFunctions,
    private fileSaver: FileSaverService
  ) {
  }

  ngOnInit(): void {
    this.getQuests();
  }

  async close() {
    const close: boolean = await this.functions.confirm("Deseja encerrar a pesquisa?", {
      subtitle: "Todas as alterações serão perdidas",
      width: "350px"
    })

    if (close === true)
      this.dialogRef.close();
  }

  getQuests() {
    this.searchQuestService.getBySearch(this.data.interview.search_id).subscribe(
      searchQuests => {
        searchQuests.forEach(searchQuest => {
          this.answerBody.push({
            quest: searchQuest.quest,
            rate: null,
            note: ''
          })
        })
      },
      err => {
        this.functions.showNotification("Ocorreu um erro ao carregar as perguntas", 3)

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

  genTxtFile() {
    let file: string = "=== Arquivo criado após erro de criação de pesquisa.\n"
      + "=== Utilize os dados abaixo para criar a pesquisa novamente mais tarde.\n\n\n\n";

    file += `# Pesquisa de ${this.data.search_type}\n\n-- Cliente: ${this.data.interview.client_name}\n-- Cidade: ${this.data.interview.city.name}`;

    this.answerBody.forEach(answer => {
      file += `\n\n\n## ${answer.quest.question}\n--- Nota: ${answer.rate}\n--- Comentário: ${answer.note || '--sem comentário--'}`
    });

    const blob = new Blob([file], {
      type: "text/plain;charset=utf-8"
    });

    this.fileSaver.save(blob, `${this.data.interview.client_name} - Erro de Pesquisa.txt`);
  }

  async submit() {
    const interviewBody: InterviewBody = {
      client_name: this.data.interview.client_name,
      search_id: this.data.interview.search_id,
      city_id: this.data.interview.city.id,
      interview_date: this.functions.dateConverter(new Date())
    }

    this.functions.confirm("Deseja finalizar a pesquisa agora?").then(suc => {
      if (suc === true) {
        this.showButtons = false;

        this.postInterview(interviewBody);
      }
    })
  }

  postInterview(interviewBody: InterviewBody) {
    this.interviewService.post(interviewBody).subscribe(
      interview => {
        this.putAnswer(interview.id, 0);
      },
      async err => {
        console.log(err);

        this.functions.showNotification("Ocorreu um erro ao criar a pesquisa", 3)

        if (await this.functions.confirm("Deseja tentar novamente?", {
          subtitle: "Ocorreu um erro ao criar a pesquisa"
        }))
          this.postInterview(interviewBody);

        else {
          this.genTxtFile();

          this.dialogRef.close();
        }
      }
    )
  }

  async getAnswerId(interview_id: Number, quest_id: Number) {
    const answer = await this.answerService.get('interview=' + interview_id, 'quest=' + quest_id).toPromise();

    return answer[0].id;
  }

  async putAnswer(interview_id: Number, index: number) {
    if (index < this.answerBody.length) {
      const answer_id = await this.getAnswerId(interview_id, this.answerBody[index].quest.id);

      this.answerService.put(answer_id, {
        rate: this.answerBody[index].rate,
        note: this.answerBody[index].note
      }).subscribe(
        () => {
          this.putAnswer(interview_id, index + 1);
        },
        async err => {
          console.log(err);

          this.functions.showNotification("Ocorreu um erro ao salvar as respostas", 3)

          if (await this.functions.confirm("Deseja tentar novamente?", {
            subtitle: "Ocorreu um erro ao salvar as respostas"
          }))
            this.putAnswer(interview_id, 0);

          else {
            this.genTxtFile();

            this.dialogRef.close();

            await this.interviewService.delete(interview_id).toPromise();
          }
        }
      )
    }
    else {
      this.functions.showNotification("Pesquisa criada com sucesso!", 1)

      this.dialogRef.close();
    }
  }

}
