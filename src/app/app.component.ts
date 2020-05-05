import { animate, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { bounceIn } from 'ng-animate';
import * as VOICES from '../data/voices.json';
import { Voice } from './interfaces/voices';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [
    trigger('intro', [
      transition('* => *',
        useAnimation(bounceIn))
    ]),
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(100)
      ]),
      transition('* => void', [
        style({ opacity: 1 }),
        animate(100)
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'icon', 'tags', 'actions'];
  public dataSource: MatTableDataSource<Voice>;
  public voices: Voice[];
  public favorites: Voice[];
  public randomVoice: Voice;
  public filter: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor() {
    this.voices = (VOICES as any).default;
    this.dataSource = new MatTableDataSource(this.voices);
    this.favorites = [];
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public applyFilter(event: Event): void {
    this.filter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filter.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public pickRandomVoice(): void {
    const ids = this.voices.map(v => v.id);
    const randomid = ids[Math.floor(Math.random() * ids.length)];
    this.randomVoice = this.voices.find((v: Voice) => v.id === randomid);
  }

  public toggleFavorite(row: Voice): void {
    row.favorite = !row.favorite;
    this.favorites = this.voices.filter((v: Voice) => v.favorite);
  }

  public removeFavorite(voice: Voice): void {
    voice.favorite = !voice.favorite;
    this.favorites.splice(this.favorites.indexOf(voice), 1);
  }

  public clearFilter(): void {
    this.filter = '';
    this.dataSource.filter = this.filter;
  }
}
