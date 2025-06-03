import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {WatchList} from '../../watchlist';
import {WatchlistService} from '../service';
import {CommonService} from '../../services/common.service';
import {FormControl} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '../../common';
import {DictionaryService} from "../../core/services/dictionary.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatModuleModule} from '../../common/mat-module';



@Component({
  standalone: true,
  imports: [MatModuleModule, CommonModule],
  providers: [WatchlistService],
  selector: 'app-watchlist-edit',
  templateUrl: './watchlist-edit.component.html',
  styleUrls: []
})
export class WatchlistEditComponent extends UnsubscribeOnDestroyAdapter {
  errorMsg!: string;
  permissions                           = [];
  updateButton!: boolean;
  loading                               = false;
  @Output() saveWatchlistMsg            = new EventEmitter<any>();
  @Output() updatedWatchlist            = new EventEmitter<any>();
  @Input() buttonsView: any;
  watchList                             = new WatchList();
  watchListError!: any[];
  read                                  = new FormControl();
  write                                 = new FormControl();
  readPermission                        :any;
  editPermission                        :any;
  watchListXid                          : any;
  messageError!: boolean;
  nameLength                            : boolean = false;
  UIDICTIONARY                          : any;
  titleHideShow!: boolean;

  constructor(private http: HttpClient, private route: ActivatedRoute, private watchlistService: WatchlistService, public dictionaryService: DictionaryService, private commonService: CommonService, private _snackBar: MatSnackBar) {
    super();
    this.setPointSendPermission();
  }

  ngOnInit() {
     this.dictionaryService.getUIDictionary('watchlist').subscribe(data=>{
     this.UIDICTIONARY= this.dictionaryService.uiDictionary;
    });
  }

  setPointSendPermission() {
    this.subs.add(this.commonService.getPermission().subscribe(data => {
      this.permissions = data;
    }, err => console.log(err)));
  }

  showWatchListDetail(xid: string) {
    this.updateButton = true;
    this.subs.add(this.watchlistService.getWatchListData(xid).subscribe(data => {
      this.watchList = data;
      // this.displayPermissions();
      this.titleHideShow = true;
    }, err => this.errorMsg = err));
  }

  resetWatchList() {
    this.watchList = new WatchList();
    this.readPermission = [];
    this.editPermission = [];
    this.titleHideShow = false;
  }

  displayPermissions() {
    /* set readPermission data */
    this.readPermission  = [];
    this.editPermission  = [];
    const readPermission = this.watchList.readPermission;
    this.readPermission  = readPermission.split(',');
    const editPermission = this.watchList.editPermission;
    this.editPermission  = editPermission.split(',');
  }

  saveWatchList() {
    this.setWatchListPermissionToModel();
      this.subs.add(this.watchlistService.saveWatchList(this.watchList).subscribe(data => {
        this.saveWatchlistMsg.emit(data);
      }, error => {
        this.watchListError = error.result.message;
        this.timeOutFunction();
      }));
  }

  deleteInputStream(data:any){
     if (data.target.value.length <= 30){
           this.nameLength = true;
     } else if(data.target.value.length == 0){
          this.nameLength = false;
     }
  }

  updateWatchlist() {
    this.setWatchListPermissionToModel();
    this.subs.add(this.watchlistService.updateWatchlist(this.watchList).subscribe(data => {
      this.updatedWatchlist.emit(data);
    }, error => {
      this.watchListError = error.result.message;
       this.timeOutFunction();
    }));
  }

  private timeOutFunction(){
    this.messageError = true;
    setTimeout(()=>{
      this.messageError = false;
    }, 3000);
  }



  private setWatchListPermissionToModel() {
    if (this.readPermission) {
      this.watchList.readPermission = this.readPermission.toString();
    }
    if (this.editPermission) {
      this.watchList.editPermission = this.editPermission.toString();
    }
  }
}
