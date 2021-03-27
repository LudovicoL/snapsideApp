export interface IAd{
  idAd: number,
  title: string,
  description: string,
  sellPrice: string,
  address: string,
  coordinates: string,
  approved: number,
  active: boolean
  adType: string,
  user_id_seller: number,
  item_id_item: number,
  endDate: number,
  beginDate: number,
  files: any;
  deleted: string
  lastEdit: number,
  creationDate: number
}
