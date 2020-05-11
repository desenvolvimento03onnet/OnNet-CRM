import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalFunctions } from './../../global';
import { QuestService } from './../../services/quest.service';
import { SearchQuestService } from './../../services/searchQuest.service';
import { SearchService } from './../../services/search.service';
import { Search } from './../../models/Search';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Quest } from './../../models/Quest';
import { Component, OnInit, Inject } from '@angular/core';

interface StoreQuest {
  question: String;
  active: Boolean;
  searches: Number[];
}

@Component({
  selector: 'app-modal-put-quest',
  templateUrl: './modal-put-quest.component.html',
  styleUrls: ['./modal-put-quest.component.css']
})
export class ModalPutQuestComponent implements OnInit {

  private quest: StoreQuest;
  private searchesId: Number[] = [];
  private searchesInQuest: Search[] = [];
  private searchesOutQuest: Search[] = [];

  private questsInLoading = true;
  private questsOutLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Quest,
    private dialogRef: MatDialogRef<ModalPutQuestComponent>,
    private questService: QuestService,
    private searchService: SearchService,
    private searchQuestService: SearchQuestService,
    private snackBar: MatSnackBar,
    private globalFunc: GlobalFunctions
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    this.refreshQuest();
    await this.refreshSearches();
    this.questsInLoading = false;
  }

  refreshQuest() {
    if (this.data) {
      this.quest = {
        question: this.data.question,
        active: Boolean(this.data.active),
        searches: []
      }
    }
    else {
      this.quest = {
        question: "",
        active: true,
        searches: []
      }
    }
  }

  async refreshSearches() {
    if (this.data) {
      this.searchQuestService.getByQuest(this.data.id).subscribe(
        searchQuests => {
          searchQuests.forEach(searchQuest => {
            this.searchesInQuest.push(searchQuest.search);
            this.searchesId.push(searchQuest.search_id);
          })

          this.quest.searches = this.searchesId;
        }
      )

      this.searchesOutQuest = await this.searchService.getExceptQuest(this.data.id).toPromise();
      this.questsOutLoading = false;
    }
    else {
      this.searchesOutQuest = await this.searchService.get("active=1").toPromise()
      this.questsOutLoading = false;
    }
  }

  changeActive(active: Boolean) {
    this.quest.active = active;
  }

  addSearch(search: Search) {
    this.searchesInQuest.push(search);
    this.searchesOutQuest.splice(this.searchesOutQuest.indexOf(search), 1);
  }

  removeSearch(search: Search) {
    this.searchesOutQuest.unshift(search);
    this.searchesInQuest.splice(this.searchesInQuest.indexOf(search), 1);
  }

  onSubmit() {
    if (this.data)
      this.putQuest()

    else
      this.postQuest();
  }

  postQuest() {
    if (!this.quest.question)
      this.snackBar.open('Insira a descrição da pergunta', 'Fechar');
    else {
      let searches: Number[] = [];

      this.searchesInQuest.forEach(search => {
        searches.push(search.id);
      })

      this.quest.searches = searches;

      this.questService.post(this.quest).subscribe(
        () => {
          this.globalFunc.showNotification("Pergunta criada com sucesso!", 1)

          this.dialogRef.close();
        },
        err => {
          this.globalFunc.showNotification("Ocorreu um erro durante a criação", 3)

          console.log(err);
        }
      )
    }
  }

  putQuest() {
    const questSubmit = this.quest;
    let searches: Number[] = [];

    this.searchesInQuest.forEach(search => {
      searches.push(search.id);
    })

    questSubmit.searches = searches;

    if (this.quest.question == this.data.question)
      delete questSubmit.question;

    if (this.quest.active == Boolean(this.data.active))
      delete questSubmit.active

    if (JSON.stringify(searches) == JSON.stringify(this.searchesId))
      delete questSubmit.searches

    if (JSON.stringify(questSubmit) != '{}') {
      this.questService.put(this.data.id, questSubmit).subscribe(
        () => {
          this.globalFunc.showNotification("Pergunta alterada com sucesso!", 1)

          this.dialogRef.close();
        },
        err => {
          console.log(err);

          this.globalFunc.showNotification("Ocorreu um erro durante a alteração", 3)
        }
      )
    }
    else {
      this.snackBar.open('Nenhuma alteração realizada', 'Fechar', { duration: 1000 })
    }
  }
}
