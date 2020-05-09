import { GlobalFunctions } from './../../global';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})
export class TypographyComponent implements OnInit {

  constructor(
    private globalFunc: GlobalFunctions,
  ) { }

  ngOnInit() {
  }

  dados: Object[] = [
    { pesquisa: 'Satisfação', nome: 'Vinícius Gomes Correia', pergunta: 'O atendente foi cordial e esclareceu todas as dúvidas?', nota: '5', comentario: 'Comentário'},
    { pesquisa: 'Satisfação', nome: 'Vinícius Gomes Correia', pergunta: 'A data agendada foi cumprida?', nota: '5', comentario: 'Comentário'},
    { pesquisa: 'Satisfação', nome: 'Vinícius Gomes Correia', pergunta: 'Em relação a funcionamento da internet, o técnico conferiu o sinal do wi-fi em seus equipamentos? Ex: Celular, Notebooks, Smart TV etc.', nota: '5', comentario: 'Comentário'},
    { pesquisa: 'Verificação', nome: 'Eduardo Alcebíades', pergunta: 'O problema foi resolvido?', nota: '5', comentario: 'Comentário 2'},
    { pesquisa: 'Verificação', nome: 'Eduardo Alcebíades', pergunta: 'O técnico ao finalizar a verificação da internet deixou o ambiente organizado?', nota: '5', comentario: 'Comentário 2'},
    { pesquisa: 'Verificação', nome: 'Eduardo Alcebíades', pergunta: 'O técnico ao finalizar a verificação da internet deixou o ambiente organizado?', nota: '5', comentario: 'Comentário 2'},
    { pesquisa: 'Verificação', nome: 'Eduardo Alcebíades', pergunta: 'O problema foi resolvido?', nota: '5', comentario: 'Comentário 2'},
    { pesquisa: 'Verificação', nome: 'Eduardo Alcebíades', pergunta: 'O técnico ao finalizar a verificação da internet deixou o ambiente organizado?', nota: '5', comentario: 'Comentário 2'},
    { pesquisa: 'Verificação', nome: 'Eduardo Alcebíades', pergunta: 'O técnico ao finalizar a verificação da internet deixou o ambiente organizado?', nota: '5', comentario: 'Comentário 2'}
  ]

  data = new MatTableDataSource(this.dados)

  displayedColumns: string[] = ['search', 'name', 'question', 'rate', 'note']

  applyFilter(event: Event){
    const padronize = this.globalFunc.padronize;

    const filterValue = padronize((event.target as HTMLInputElement).value)
    this.data.filter = filterValue.trim().toLowerCase()
  }

}
