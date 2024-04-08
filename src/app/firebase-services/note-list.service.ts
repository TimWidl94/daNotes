import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();

  }

  // const itemCollection = collection(this.firestore, 'items');

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getcolIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note))
        .catch((err) => {
          console.log(err);
        })
        .then(() => {});
    }
  }

  getcolIdFromNote(note: Note):string {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  getCleanJson(note:Note):{}{
    return{
    type: note.type,
    title: note.title,
    content: note.content,
    marked: note.marked,
    }
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));

      });
    });
  }

  subNotesList() {
    this.normalNotes = [];
    return onSnapshot(this.getNotesRef(), (list) => {
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  async addNote(item: Note, colId: "notes" | "trash") {
    const docRef = await addDoc(this.getNotesRef(), item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef);
      });
  }



  async deleteNote(colId: "notes" | "trash", docId: string){
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.log(err)
    })
  }

}
