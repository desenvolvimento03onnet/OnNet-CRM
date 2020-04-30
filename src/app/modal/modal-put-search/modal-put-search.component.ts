import { Quest } from './../../models/Quest';
import { QuestService } from './../../services/quest.service';
import { SearchService } from './../../services/search.service';
import { Search } from './../../models/Search';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface StoreSearch {
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


  private search: StoreSearch;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Search,
    private dialogRef: MatDialogRef<ModalPutSearchComponent>,
    private searchService: SearchService,
    private questService: QuestService,
  ) { }

  ngOnInit(): void {
    this.refreshQuests();
    this.refreshSearch();
  }

  async refreshQuests() {
    let questsOut: Quest[];

    if (this.data) {
      const searchIn = await this.searchService.getById(this.data.id).toPromise();
      questsOut = await this.questService.getExceptSearch(this.data.id).toPromise()

      this.questsInSearch = searchIn[0].quests;
      this.questsOutSearch = questsOut;
    }
    else {
      this.questsOutSearch = await this.questService.get("active=1").toPromise();
    }
  }

  refreshSearch() {
    if (this.data) {
      this.search = {
        type: this.data.type,
        active: this.data.active,
        quests: []
      }

      this.data.quests.forEach(quest => {
        this.search.quests.push(quest.id);
      })
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
    this.questsInSearch.unshift(quest);
    this.questsOutSearch.splice(this.questsOutSearch.indexOf(quest), 1);
  }

  removeQuest(quest: Quest) {
    this.questsOutSearch.unshift(quest);
    this.questsInSearch.splice(this.questsInSearch.indexOf(quest), 1);
  }

  drop(event: CdkDragDrop<Quest[]>) {
    moveItemInArray(this.questsInSearch, event.previousIndex, event.currentIndex);
  }
}