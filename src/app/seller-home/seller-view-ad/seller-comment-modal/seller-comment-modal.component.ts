import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CommentService } from 'src/app/services/comment.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-seller-comment-modal',
  templateUrl: './seller-comment-modal.component.html',
  styleUrls: ['./seller-comment-modal.component.scss'],
})
export class SellerCommentModalComponent implements OnInit {

  modalTitle: string;
  modelId: number;
  commenterUname: string;
  text: string;
  userid;
  ratingSel = -1;
  idAd;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    // tslint:disable-next-line: variable-name
    private _comment: CommentService,
    // tslint:disable-next-line: variable-name
    private _data: DataService
  ) { }

  ngOnInit() {
    // console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.commenterUname = this.navParams.data.commenterUname;
    this.modalTitle = this.navParams.data.paramTitle;
    this.text = this.navParams.data.text;
    this._data.userid.subscribe(data => this.userid = data);
    this.idAd = this.navParams.data.idAd;
  }

  async closeModal() {
    // tslint:disable-next-line: no-inferrable-types
    const onClosedData: string = 'Wrapped Up!';
    await this.modalController.dismiss(onClosedData);
  }

  saveComment(idcomment, text, idAd) {
    // console.log(this.userid, this.ratingSel);
    this._comment.saveComment(idcomment, text, this.ratingSel, this.userid, idAd)
      .subscribe(res => {console.log(res); });
  }
  setRating(value) {
    this.ratingSel = value;
    // console.log(this.ratingSel);
  }

}
