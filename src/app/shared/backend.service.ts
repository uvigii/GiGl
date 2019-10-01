import { Injectable } from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import * as Platform from "tns-core-modules/platform";
import { Config } from "./config";

var Sqlite = require("nativescript-sqlite");

@Injectable({providedIn: "root"})
export class BackendService {

    items: Array<any>;
    lang: string;
    
    constructor() {        
        if (!Sqlite.exists(Config.dbname)) {
            console.log("bs: DB Copy");
            Sqlite.copyDatabase(Config.dbname);
        }else{
            console.log("bs: DB Exist");
        }   

        this.lang = (Platform.device.language.split("-")[0]);
        console.log("bs: Lang = "+ this.lang);
        //this.translate.use(Platform.device.language.split("-")[0]);
        
    }
    
    
    getFavorite():Array<any>{
        if (appSettings.getString("Favorite","") == ""){
            let arr = new Array<any>();
            return arr;
        } else {
            return JSON.parse(appSettings.getString("Favorite",""));
        }
    }

    setFavorite(arr:Array<any>):void{
        appSettings.setString("Favorite",JSON.stringify(arr));               
    }

    public searchItems(key:string = "", fav:string = ""){ 
    let q:string = "SELECT * FROM foods where name_"+ this.getLang() +" like '%" + key + "%'";
    if (fav != "" ){    q = q + " and id in("+fav+")" }
        return new Promise((resolve, reject) => {         
            this.openDB()
            .then((res: any) => {
                      res.resultType(Sqlite.RESULTSASOBJECT);
              return  res.all(q).then(
                            rows => {  
                            resolve(rows);                           
                            },
                            error => { console.log("SELECT USERS ERROR: ", error); 
                            reject(error);
                            }
                            
                        )
            })
            .catch((err) => {
                console.log(err.message); // something bad happened
            });        
        })
   }
    
   public getAllItems(){ 
        console.log("SELECT * FROM foods order by food_type, name_"+ this.getLang());
        return new Promise((resolve, reject) => {         
            this.openDB()
            .then((res: any) => {
                    res.resultType(Sqlite.RESULTSASOBJECT);
            return  res
                    
                    .all("SELECT * FROM foods order by type_id, name_"+ this.getLang() ).then(
                            rows => {  
                            resolve(rows);                           
                            },
                            error => { console.log("SELECT", error); 
                            reject(error);
                            }
                            
                        )
                        
            })
            .catch((err) => {
                console.log(err.message); // something bad happened
            });        
        })
   }

    private openDB() {
        return new Promise((resolve, reject) => {
            return (new Sqlite(Config.dbname))            
            .then(db => {
                resolve(db);
            }, error => {
                reject(error);
            })
        })
    }

    public getLang(){
        if (Config.langs.find(x => x == this.lang)){
            return this.lang;
        } else {
            return Config.default_lang;
        }
    }
        
}