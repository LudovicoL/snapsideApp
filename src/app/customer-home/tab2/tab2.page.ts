import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AdService } from 'src/app/services/ad.service';
import { IAd } from 'src/app/interfaces/ad';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  start={lat: 40.351382, long: 18.174981}
  zoom=10;
  height = 0;
  ads : IAd[]
  markersInfo=[];
  
  constructor(public platform: Platform, private _adService: AdService) {
    console.log(platform.height());
    this.height = platform.height() - 56;
  }

  markers = [{
    placeName: "Australia (Uluru)",
    LatLng: [{
        lat: -25.344,
        lng: 131.036
    }]
},
{
    placeName: "Australia (Melbourne)",
    LatLng: [{
        lat: -37.852086,
        lng: 504.985963
    }]
},
{
    placeName: "Australia (Canberra)",
    LatLng: [{
        lat: -35.299085,
        lng: 509.109615
    }]
},
{
    placeName: "Australia (Gold Coast)",
    LatLng: [{
        lat: -28.013044,
        lng: 513.425586
    }]
},
{
    placeName: "Australia (Perth)",
    LatLng: [{
        lat: -31.951994,
        lng: 475.858081
    }]
}
];

  ngOnInit(){

    this._adService.getAllPublished().subscribe(data=>{this.ads=data;
      var that=this;
      this.ads.forEach(function(entry,index){
        if(entry.coordinates!=null && entry.coordinates.search('lat')>-1 )
        {
          console.log(JSON.parse(entry.coordinates))
          entry['lat']=JSON.parse(entry.coordinates)[0].lat
          entry['long']=JSON.parse(entry.coordinates)[0].long
          that.markersInfo.push(entry)
        }
      })
      
    
    })
    
  


  }
  
  onMouseClick(infoWindow, gm) {

    if (gm.lastOpen != null) {
        gm.lastOpen.close();
    }

    // gm.lastOpen = infoWindow;

    infoWindow.open();
}


  myAlert(msg)
  {
    alert(msg)
  }
  prettyPrice(price){
    return Number(price).toFixed(2).toString().replace(".",",") // pads the zeros and then replaces . with ,
    }
}
