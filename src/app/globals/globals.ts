'use strict';

//Command for local network hosting: ng serve --host 0.0.0.0 --port 4201

export const serverip: string="192.168.1.221";       // Andrea
//export const serverip: string="192.168.1.149";          // Ludovico
// export const serverip: string="10.0.2.2"; //for android/cordova simulator connection 
export const port: string=":8080";
//export const serverip = 'localhost';
export const serverUrl ='http://'+serverip+port;
export const loginUrl=serverUrl+'/user/login';


export const notifTrigger='FIREBASE';

// export const notifTrigger='PERIODIC_REFRESH';
export const firebaseServerKey= 'key=AAAAM7YSJfU:APA91bExxmy74YYfnP0Vw1d3idZumjU0-odcy3E5u3sk3fsdRwuz9f8fec5IeMj0H0vcvg7rmajcbMjIu6oQ4XJoOEZPLht6sB48BZLw834Cq8DexX637nyGO3-C4CdslbLjJxWK9G62'