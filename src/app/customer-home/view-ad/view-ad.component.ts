import { Component, OnInit, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdService } from 'src/app/services/ad.service';
import { CategoryService } from 'src/app/services/category.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GuiService } from 'src/app/services/gui.service';
import { MediaService } from 'src/app/services/media.service';
import * as moment from 'moment';
import { BenefitService } from 'src/app/services/benefit.service';
import { IBenefit } from 'src/app/interfaces/benefit';
import { CommentService } from 'src/app/services/comment.service';
import { ModalController } from '@ionic/angular';
import { CommentModalPage } from './comment-modal/comment-modal.page';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { NotifService } from 'src/app/services/notif.service';
import { IUser } from 'src/app/interfaces/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-ad',
  templateUrl: './view-ad.component.html',
  styleUrls: ['./view-ad.component.scss'],
})
export class ViewAdComponent implements OnInit {
  idAd : string;
  
  dateNow: Date;
  mobile=false;
  public ad;
  public category;
  public item;
  public isCollapsed = false;
  public attributes=[];


  nImgsArray=[];

  public media;
  
  displayMedia=[]
  frontImg;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  start={lat: 40.351382, long: 18.174981}
  parsedPoints=[]
  benefits:IBenefit[]


  public comments = [];
  public selectedCommenter;
  maxRating=5
  maxRatingStars=[]
  mainCommentText=''
  ratingSel='-1'
  public commentIndexes=[]
  public cc=[]
  dataReturned:any;
  selectedCommentID=null
  selectedCommentText=null
  userid;
  c_timeout=null
  showMoreDescription=false;
  constructor(private route: ActivatedRoute,
    private _adService: AdService,
    private _catService: CategoryService,
    private _sanitizer: DomSanitizer,
    private _gui: GuiService,
    private cdRef:ChangeDetectorRef,private el: ElementRef, private renderer:Renderer2,
    private _media: MediaService,
    private _benefits: BenefitService,
    private _comment: CommentService,
    private _data: DataService,
    public modalController: ModalController,
    private _user : UserService,
    private _notif: NotifService,
    private location: Location
    ) { }


ngOnDestroy()
{
  if(this.c_timeout!=null){
    clearTimeout(this.c_timeout)
  }
}

  ngOnInit() {

    const refresher = document.getElementById('refresher-view');
    refresher.addEventListener('ionRefresh',  () => {
     this.c_timeout= setTimeout( () => {

        this.refresher();
        (<any>refresher).complete();

      }, 1000);
    })

    const param_idAd: string = this.route.snapshot.queryParamMap.get('idAd');
    this.idAd=param_idAd
    this._data.userid.subscribe(data=>this.userid=data)
    this._gui.sendFocusedAdId(param_idAd)

    this._adService.getAdById(this.idAd).subscribe(data => {this.ad=data;this.gatherCoordinates();
      this._benefits.getBenefitsHaveAd(this.idAd).subscribe(data=>{this.benefits=data})
    
      this._user.getUserById(this.ad.user_id_seller).subscribe(data=>{this.ad['sellerUsername']=data.username})});

    this._catService.getCatFromAd(this.idAd).subscribe(data=>{this.category=data})
    this._catService.getItemFromAd(this.idAd).subscribe(data=>{this.item=data})

    

    this.getAttributeInfo(this.idAd)
    
    this._media.getAllImagesFromAd(this.idAd).subscribe(data=>{this.media=data;
      this.nImgsArray = Array(data.length+1).fill(0).map((x,i)=>i);
      this.nImgsArray.shift()

      console.log(this.nImgsArray)
      this.displayMedia=[]
      this.media.forEach((img, index) => {
      this.displayMedia.push({content:this.getImageSanitized(img.content), mediaName:img.mediaName})
    });
    console.log(this.displayMedia)
      })

      this.ratingSel="-1"
      
      this.maxRatingStars = Array(this.maxRating+1).fill(0).map((x,i)=>i);
      this.maxRatingStars.shift()

      var that=this;
      this._comment.getAllCommentsFromAd(this.idAd)
      .subscribe(data => {this.comments = data;
                          // console.log(this.comments);
                          this.comments.forEach(function(entry, index) {that._comment.getUserFromComment(entry.idComment)
                            .subscribe(user => { entry['username'] = user.username;
                                                entry['uimage'] = user.userImg; });
        }); });

    
  }
  refresher(){
    this.ngOnInit()
  }
  
  toggleShowMoreDescription(){
    this.showMoreDescription=!this.showMoreDescription
  }
  getAttributeInfo(idAd){
    var that=this
    var attributeNames;
    var attributeValues;
    this._adService.getAttributes(idAd).subscribe(responseList => {
      attributeNames=responseList[0];
      attributeValues=responseList[1];

      var mergedAttributes=[]
      attributeNames.forEach(function(entry,index) {
        console.log(entry.attributeName)
        var attribute = {};
        attribute['name'] = entry.attributeName
        attribute['value'] = attributeValues[index].attributeValue

        mergedAttributes=mergedAttributes.concat(attribute);

      });
      that.attributes=mergedAttributes;
      // console.log(this.attributes)

    }

    )
  }
  prettyPrice(price){
    return Number(price).toFixed(2).toString().replace(".",",") // pads the zeros and then replaces . with ,
    }

    getImageSanitized(base64img)

    {
    
      if (base64img===null){
    
        return ("assets/utils_imgs/noimg.svg")
      }
      else if (base64img.lastIndexOf('/9j',0)===0){
      return this._sanitizer.bypassSecurityTrustResourceUrl("data:image/jpg;base64, " + base64img);
      }
      else {
        return this._sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64, " + base64img);
        }
    }
    
    getImageNotSanitized(base64img)
    
    {
    
      if (base64img===null){
    
        return ("assets/utils_imgs/avatar3.svg")
      }
      else if (base64img.lastIndexOf('/9j',0)===0){
      return "data:image/jpg;base64, " + base64img;
      }
      else {
        return "data:image/png;base64, " + base64img;
        }
    }

    prettyDateTime(timestamp) {
      const t = parseInt(timestamp);
      return moment(t).format('DD-MMM-YYYY HH:mm:ss');
    }
  
    
    prettyDate(timestamp) {
      const t = parseInt(timestamp);
      return moment(t).format('DD-MMM-YYYY');
    }

    gatherCoordinates(){

      this.parsedPoints=JSON.parse(this.ad.coordinates)
      if(this.parsedPoints!==null && this.parsedPoints.length!==0){
         this.initMapPan()
      }
      // console.log(this.parsedPoints)
      // console.log(this.points)
  
    }
  
    initMapPan(){
  
      this.start=this.parsedPoints[0]
    }

    toStr(integer){
      return integer.toString()
    }


    async openModal() {
      const modal = await this.modalController.create({
        component: CommentModalPage,
        componentProps: {
          "paramID": this.selectedCommentID,
          "commenterUname": this.selectedCommenter,
          "paramTitle": "Answer to comment",
          "text":this.selectedCommentText,
          "idAd":this.idAd
        }
      });
   
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
          this.dataReturned = dataReturned.data;
          //alert('Modal Sent Data :'+ dataReturned);
        }
        this.ngOnInit()
      });
   
      return await modal.present();
    }

    setSelectedComment(id,text,commenterUname){
      this.selectedCommentID=id
      this.selectedCommentText=text
      this.selectedCommenter=commenterUname
    }



    saveComment(idcomment,text,idAd)
    { console.log(this.userid,this.ratingSel)
      this._comment.saveComment(idcomment,text,this.ratingSel,this.userid,idAd)
      .subscribe(res => {console.log(res); this.ngOnInit()});
    
    }
    setRating(value)
    {
      this.ratingSel=value
      console.log(this.ratingSel)
    }

    interesting()
    {
      var toastController = document.querySelector('ion-toast-controller');
      var token;
      var userid;
      var body;
      var senderUser:IUser 
      var title = "A customer is interested to your ad"
      this._data.userid.subscribe(data=>userid=data)
      this._user.getUserById(userid).subscribe(data=>{senderUser=data;
        body="Customer @"+senderUser.username+" is interested to your ad '"+this.ad.title+ "' (#"+this.ad.idAd+")";
      
        this._user.getUserById(this.ad.user_id_seller).subscribe(data=>{token=data.token; console.log(token)
          this._notif.sendToastNotif(this.ad.user_id_seller,body,title).subscribe(data=>console.log(data))
          this._notif.firebasePush(token,body,title).subscribe(data=>console.log(data))
        })
        toastController.create({
          color: 'primary',
          duration: 3000,
          message: 'OK! Notification sent to seller',
          showCloseButton: true
        }).then(toast => {
          toast.present();
        });
      })
     
      


    }

    goBack(){
      this.location.back()
    }
}
