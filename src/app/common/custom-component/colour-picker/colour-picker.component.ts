import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: []
})
export class ColourPickerComponent {
  @Input()
  heading!: string;
  @Input()
  color!: string;
  @Output() event: EventEmitter<string> = new EventEmitter<string>();
  public show = false;
  public defaultColors: string[] = [
    '#ffffff',
    '#000105',
    '#3e6158',
    '#3f7a89',
    '#96c582',
    '#7FFF00',
    '#bcd6e7',
    '#7c90c1',
    '#9d8594',
    '#006400',
    '#4b4fce',
    '#4e0a77',
    '#a367b5',
    '#ee3e6d',
    '#d63d62',
    '#c6a670',
    '#f46600',
    '#cf0500',
    '#efabbd',
    '#8e0622',
    '#f0b89a',
    '#f0ca68',
    '#FFFF00',
    '#62382f',
    '#c1800b'
  ];

  constructor() {
  }

  /**
   * Change color from default colors
   * @param {string} color
   */
  public changeColor(color: string): void {
    this.color = color;
    this.event.emit(this.color);
    this.show = false;
  }


  /**
   * Change color from input
   * @param {string} color
   */
  public toggleColors(): void {
    this.show = !this.show;
  }
}
