import { GlobalFunctions } from './../../global';
import { SearchQuestService } from './../../services/searchQuest.service';
import { Quest } from './../../models/Quest';
import { QuestService } from './../../services/quest.service';
import { SearchService } from './../../services/search.service';
import { Search } from './../../models/Search';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

interface StoreSearch {
  type?: String,
  quests?: Number[],
  active?: Boolean
}

@Component({
  selector: 'app-modal-put-search',
  templateUrl: './modal-put-search.component.html',
  styleUrls: ['./modal-put-search.component.css']
})
export class ModalPutSearchComponent implements OnInit {
  private questsInSearch: Quest[] = [];
  private questsOutSearch: Quest[] = [];

  private questsId: Number[] = [];

  private search: StoreSearch;

  private questsInLoading = true;
  private questsOutLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Search,
    private dialogRef: MatDialogRef<ModalPutSearchComponent>,
    private searchService: SearchService,
    private questService: QuestService,
    private searchQuestService: SearchQuestService,
    private snackBar: MatSnackBar,
    private functions: GlobalFunctions
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  async refresh() {
    this.refreshSearch();
    await this.refreshQuests();
    this.questsInLoading = false;
  }

  async refreshQuests() {
    if (this.data) {
      this.searchQuestService.getBySearch(this.data.id).subscribe(
        searchQuests => {
          searchQuests.forEach(searchQuest => {
            this.questsInSearch.push(searchQuest.quest);
            this.questsId.push(searchQuest.quest_id);
          })

          this.search.quests = this.questsId
        },
        err => {
          this.functions.showNotification("Não foi possível carregar as perguntas", 2)

          console.log(err);
        }
      )

      this.questsOutSearch = await this.questService.getExceptSearch(this.data.id, "active=1").toPromise();
      this.questsOutLoading = false;
    }
    else {
      this.questsOutSearch = await this.questService.get("active=1").toPromise();
      this.questsOutLoading = false;
    }
  }

  refreshSearch() {
    if (this.data) {
      this.search = {
        type: this.data.type,
        active: Boolean(this.data.active),
        quests: []
      }
    }
    else {
      this.search = {
        type: "",
        active: true,
        quests: []
      }
    }
  }

  changeActive(active: Boolean) {
    this.search.active = active;
  }

  addQuest(quest: Quest) {
    this.questsInSearch.push(quest);
    this.questsOutSearch.splice(this.questsOutSearch.indexOf(quest), 1);
  }

  removeQuest(quest: Quest) {
    this.questsOutSearch.unshift(quest);
    this.questsInSearch.splice(this.questsInSearch.indexOf(quest), 1);
  }

  drop(event: CdkDragDrop<Quest[]>) {
    moveItemInArray(this.questsInSearch, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    if (this.data)
      this.putSearch()

    else
      this.postSearch();

  }

  async postSearch() {
    if (!this.search.type)
      this.snackBar.open('Preencha o título da pesquisa', 'Fechar', { duration: 2000 });
    else {
      let quests: Number[] = [];

      this.questsInSearch.forEach(quest => {
        quests.push(quest.id);
      });

      if (this.search.active == false)
        this.search.quests = [];

      else
        this.search.quests = quests;

      const close: boolean = await this.functions.confirm("Confirmar criação da pesquisa?", {
        width: "350px"
      })

      if (close === true)
        this.searchService.post(this.search).subscribe(
          () => {
            this.functions.showNotification("Pesquisa criada com sucesso!", 1)

            this.dialogRef.close();
          },
          err => {
            this.functions.showNotification("Ocorreu um erro durante a criação", 3)

            console.log(err);
          }
        )
    }
  }

  async putSearch() {
    const searchSubmit: StoreSearch = {};
    let quests: Number[] = [];

    this.questsInSearch.forEach(quest => {
      quests.push(quest.id);
    })

    if (this.search.type != this.data.type)
      searchSubmit.type = this.search.type;

    if (JSON.stringify(quests) != JSON.stringify(this.questsId) && Boolean(this.search.active) == true)
      searchSubmit.quests = quests;

    if (this.search.active != Boolean(this.data.active)) {
      searchSubmit.active = this.search.active;

      if (this.search.active == false)
        searchSubmit.quests = [];
    }

    if (JSON.stringify(searchSubmit) != '{}') {
      const close: boolean = await this.functions.confirm("Confirmar alteração da pesquisa?", {
        width: "350px"
      })

      if (close === true)
        this.searchService.put(this.data.id, searchSubmit).subscribe(
          () => {
            this.functions.showNotification("Pesquisa alterada com sucesso!", 1)

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