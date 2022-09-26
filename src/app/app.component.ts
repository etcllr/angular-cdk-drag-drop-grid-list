import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;

  public buttonHeight: number;
  public buttonWidth: number;
  public currentNbRows: number;
  public items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

  ngOnInit() {
    this.getCurrentNbCols();
    this.resizeGridElements();
  }

  getCurrentNbCols() {
    const nbElement = this.items.length;
    const nbCols =
      Math.sqrt(nbElement) % 1 === 0
        ? Math.sqrt(nbElement)
        : (Math.sqrt(nbElement) | 0) + 1;
    console.log(nbCols);
    this.currentNbRows =
      nbElement > nbCols * (nbCols - 1) ? nbCols : nbCols - 1;
    console.log(this.currentNbRows, nbCols);
    this.buttonWidth = window.innerWidth / nbCols;
    this.buttonHeight = window.innerHeight / this.currentNbRows;
  }

  resizeGridElements() {
    const nbElement = this.items.length + 1;
    const nbCols =
      Math.sqrt(nbElement) % 1 === 0
        ? Math.sqrt(nbElement)
        : (Math.sqrt(nbElement) | 0) + 1;
    this.buttonWidth = window.innerWidth / nbCols;
    const nbRows =
      nbCols * this.currentNbRows < nbElement
        ? this.currentNbRows + 1
        : this.currentNbRows;
    if (nbRows !== this.currentNbRows) {
      this.currentNbRows = nbRows;
      this.buttonHeight = window.innerHeight / nbRows;
    }
  }

  add() {
    this.items.push(this.items.length + 1);
    this.resizeGridElements();
  }

  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };
    console.log('dragEntered', { dragIndex, dropIndex });

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');

    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);

      moveItemInArray(this.items, dragIndex, dropIndex);
    }
  }

  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;

    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        '.cdk-drag-placeholder'
      );

    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement?.nextElementSibling
        : placeholderElement?.previousElementSibling;

    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }

  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
}
