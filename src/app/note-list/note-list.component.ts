
import { Component } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { NoteListService } from '../firebase-services/note-list.service';
import { AddNoteDialogComponent } from './../add-note-dialog/add-note-dialog.component';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent {
  noteList: Note[] = [];


  favFilter: 'all' | 'fav' = 'all';
  status: 'notes' | 'trash' = 'notes';


  constructor(private noteService: NoteListService) {}

  getList() {
    if (this.status == 'notes') {
      if(this.favFilter == "all"){
      return this.noteService.normalNotes;}
      else{ return this.noteService.normalMarkedNotes}
    } else {
      return this.noteService.trashNotes;
    }
  }

  changeFavFilter(filter: 'all' | 'fav') {
    this.favFilter = filter;
  }

  changeTrashStatus() {
    if (this.status == 'trash') {
      this.status = 'notes';
    } else {
      this.status = 'trash';
      this.favFilter = 'all';
    }
  }
}
