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
  question?: String;
  active?: Boolean;
  searches?: Number[];
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
    private functions: GlobalFunctions
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

  async postQuest() {
    if (!this.quest.question)
      this.snackBar.open('Insira a descrição da pergunta', 'Fechar', { duration: 2000 });

    else {
      let searches: Number[] = [];

      this.searchesInQuest.forEach(search => {
        searches.push(search.id);
      })

      if (this.quest.active == false)
        this.quest.searches = []

      else
        this.quest.searches = searches;

      const close: boolean = await this.functions.confirm("Confirmar criação da pergunta?", {
        width: "350px"
      })

      if (close === true)
        this.questService.post(this.quest).subscribe(
          () => {
            this.functions.showNotification("Pergunta criada com sucesso!", 1)

            this.dialogRef.close();
          },
          err => {
            this.functions.showNotification("Ocorreu um erro durante a criação", 3)

            console.log(err);
          }
        )
    }
  }

  async putQuest() {
    const questSubmit: StoreQuest = {};
    let searches: Number[] = [];

    this.searchesInQuest.forEach(search => {
      searches.push(search.id);
    })

    if (this.quest.question != this.data.question)
      questSubmit.question = this.quest.question;

    if (JSON.stringify(searches) != JSON.stringify(this.searchesId) && Boolean(this.quest.active) == true)
      questSubmit.searches = searches;

    if (this.quest.active != Boolean(this.data.active)) {
      questSubmit.active = this.quest.active;

      if (this.quest.active == false)
        questSubmit.searches = [];
    }

    if (JSON.stringify(questSubmit) != '{}') {
      const close: boolean = await this.functions.confirm("Confirmar alteração da pergunta?", {
        width: "350px"
      })

      if (close === true)
        this.questService.put(this.data.id, questSubmit).subscribe(
          () => {
            this.functions.showNotification("Pergunta alterada com sucesso!", 1)

            this.dialogRef.close();
          },
          err => {
            console.log(err);

            this.functions.showNotification("Ocorreu um erro durante a alteração", 3)
          }
        )
    }
    else
      this.snackBar.open('Nenhuma alteração realizada', 'Fechar', { duration: 2000 })
  }
}
