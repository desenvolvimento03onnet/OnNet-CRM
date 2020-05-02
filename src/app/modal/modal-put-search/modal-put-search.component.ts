import { SearchQuestService } from './../../services/searchQuest.service';
import { Quest } from './../../models/Quest';
import { QuestService } from './../../services/quest.service';
import { SearchService } from './../../services/search.service';
import { Search } from './../../models/Search';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface StoreSearch {
  type: String,
  quests: Number[],
  active: Boolean
}

@Component({
  selector: 'app-modal-put-search',
  templateUrl: './modal-put-search.component.html',
  styleUrls: ['./modal-put-search.component.css']
})
export class ModalPutSearchComponent implements OnInit {
  private questsInSearch: Quest[] = [];
  private questsOutSearch: Quest[] = [];

  questsId: Number[] = [];

  private search: StoreSearch;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Search,
    private dialogRef: MatDialogRef<ModalPutSearchComponent>,
    private searchService: SearchService,
    private questService: QuestService,
    private searchQuestService: SearchQuestService
  ) { }

  ngOnInit(): void {
    this.refreshSearch();
    this.refreshQuests();
  }

  async refreshQuests() {
    if (this.data) {
      this.searchQuestService.getBySearch(this.data.id).subscribe(
        searchQuests => {
          searchQuests.forEach(searchQuest => {
            this.questsInSearch.push(searchQuest.quest);
            this.questsId.push(searchQuest.quest_id);
          })

          this.search.quests = this.questsId;
        },
        err => {
          console.log(err);
        }
      )

      this.questsOutSearch = await this.questService.getExceptSearch(this.data.id, "active=1").toPromise();
    }
    else
      this.questsOutSearch = await this.questService.get("active=1").toPromise();

  }

  refreshSearch() {
    if (this.data) {
      this.search = {
        type: this.data.type,
        active: this.data.active,
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
    console.log(event);
    moveItemInArray(this.questsInSearch, event.previousIndex, event.currentIndex);
  }

  onSubmit() {
    if (this.data)
      this.putSearch()

    else
      this.postSearch();

  }

  postSearch() {
    if (!this.search.type)
      alert("Preencha o título da pesquisa")
    else {
      let quests: Number[] = [];

      this.questsInSearch.forEach(quest => {
        quests.push(quest.id);
      });

      this.search.quests = quests;

      this.searchService.post(this.search).subscribe(
        () => {
          this.dialogRef.close();
        },
        err => {
          console.log(err);
          this.dialogRef.close();
        }
      )
    }
  }

  putSearch() {
    const searchSubmit = this.search;
    let quests: Number[] = [];

    this.questsInSearch.forEach(quest => {
      quests.push(quest.id);
    })

    searchSubmit.quests = quests;

    if (this.search.type == this.data.type)
      delete searchSubmit.type;

    if (this.search.active == Boolean(this.data.active))
      delete searchSubmit.active

    if (JSON.stringify(quests) == JSON.stringify(this.questsId))
      delete searchSubmit.quests

    if (JSON.stringify(searchSubmit) != '{}') {
      this.searchService.put(this.data.id, searchSubmit).subscribe(
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