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

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Quest,
    private dialogRef: MatDialogRef<ModalPutQuestComponent>,
    private questService: QuestService,
    private searchService: SearchService,
    private searchQuestService: SearchQuestService
  ) { }

  ngOnInit(): void {
    this.refreshQuest();
    this.refreshSearches();
  }

  refreshQuest() {
    if (this.data) {
      this.quest = {
        question: this.data.question,
        active: this.data.active,
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
    }
    else
      this.searchesOutQuest = await this.searchService.get("active=1").toPromise()
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
      alert("Insira a descrição da pergunta");
    else {
      let searches: Number[] = [];

      this.searchesInQuest.forEach(search => {
        searches.push(search.id);
      })

      this.quest.searches = searches;

      console.log(this.quest);

      this.questService.post(this.quest).subscribe(
        () => {
          this.dialogRef.close();
        },
        err => {
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
          this.dialogRef.close();
        },
        err => {
          console.log(err);
          this.dialogRef.close();
        }
      )
    }
    else {
      alert("Nenhuma mudança realizada");
      this.dialogRef.close();
    }
  }
}
