import { Interview } from './../../models/Interview';
import { Answer } from './../../models/Answer';
import { AnswerService } from './../../services/answer.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-modal-info-interview',
  templateUrl: './modal-info-interview.component.html',
  styleUrls: ['./modal-info-interview.component.css']
})
export class ModalInfoInterviewComponent implements OnInit {

  private answers: Answer[] = [];
  private average: number = 0;
  private isc: number = 0;
  private interviewTime: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Interview,
    private answerService: AnswerService
  ) { }

  ngOnInit(): void {
    this.refreshAnswers();

    var time = this.data.interview_date.toString().split('T')[1].split('.')[0].split(':');

    time[0] = (parseInt(time[0]) - 3).toString();
    
    this.interviewTime = time[0] + ':' + time[1];
  }

  refreshAnswers() {
    this.answerService.get("interview=" + this.data.id).subscribe(
      answers => {
        const weight: number[] = [0, 0, 20, 80, 100];
        this.answers = answers;

        answers.forEach(answer => {
          this.average += answer.rate;

          this.isc += weight[answer.rate - 1];
        });

        this.isc = ((this.isc / (answers.length * 100)) * 10);
        this.average /= answers.length;
      },
      err => {
        console.log(err);
      }
    )
  }

}
