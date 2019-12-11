import { Component, OnInit } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ItemService } from "../shared/item.service";
import { BackendService } from "../shared/backend.service";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { RadListView, ListViewGridLayout, ListViewLinearLayout } from "nativescript-ui-listview";
import { RouterExtensions } from "nativescript-angular/router";
import { NavigationExtras } from "@angular/router";
import { Funs } from '~/app/shared/funs'

let isLayoutOne: boolean = true;

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html",
    styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
    public items : ObservableArray<any>; 
    public favtems: Array <any>;  
    public lang:    string;
    public isFavourite: boolean = false;
    public isLinearTemplate: boolean = true;
    public curItemFavIcon: string = "~/app/images/fav-outline.png";
    public template: string = "linear";
    public query: string = ""; 

    constructor(private itemService: ItemService, private bs: BackendService, private routerExtensions: RouterExtensions) {     
            this.items = new ObservableArray();
            this.favtems = bs.getFavorite();
            this.lang = bs.getLang();
            this.queryItems();                               
    }

    ngOnInit(): void {
        //this.items = this.itemService.getItems();
    }        
    
    public onTextChanged(args) {
        let searchBar = <SearchBar>args.object;
        console.log("SearchBar text changed! New value: " + searchBar.text);
        if (searchBar.text) {
            this.query = searchBar.text;
            this.queryItems();                        
        }
        
    }

    public queryItems(){

        console.dir(this.favtems.join(','));
        this.bs.searchItems(this.query, this.isFavourite ? this.favtems.join(',') : "").then((res) => {                    
            this.items = new ObservableArray(res);                   
        })
        .catch((err) => {
            console.log(err.message); // something bad happened
        });  

    }

    public onClear(args) {
        let searchBar = <SearchBar>args.object;
        searchBar.text = "";
        this.query="";
        this.queryItems();
    }

    public onFavItemTap(args){
        
        if(this.favtems.indexOf(args.object.bindingContext.id) != -1){
            this.favtems.splice(this.favtems.indexOf(args.object.bindingContext.id),1);            
        }else{            
            this.favtems.push(args.object.bindingContext.id);
        }        
        this.bs.setFavorite(this.favtems);
        this.queryItems();
    }

    public onFavoriteToggle(args) {
        const image = args.object;
        this.isFavourite = ! this.isFavourite;
        if ( ! this.isFavourite){
            image.src = "~/app/images/fav-outline.png";
        }else{
            image.src = "~/app/images/fav-solid.png";
        }
        this.queryItems();
    }

    public onLayoutToggle(args){
        const image = args.object;
        const listView = <RadListView>image.page.getViewById("list-view");

        isLayoutOne = ! isLayoutOne;
        this.isLinearTemplate = isLayoutOne;
        if ( isLayoutOne){
            listView.swipeActions = true;
            let Layout = new ListViewLinearLayout();
            listView.listViewLayout =  Layout;
            image.src = "~/app/images/layout-grid.png";
        }else{
            listView.swipeActions = false;
            let Layout = new ListViewGridLayout();
            Layout.spanCount = 2;
            listView.listViewLayout =  Layout;
            image.src = "~/app/images/layout-linear.png";            
        }
        
        //console.dir(isLayoutOne);
    }

    public onSwipeStarted(event) {
        const item  = event.mainView.bindingContext;
        const swipeLimits = event.data.swipeLimits;
        
        swipeLimits.left = 260;
        swipeLimits.right = 0;
        swipeLimits.threshold = 140;

        if (this.favtems.indexOf(item.id) != -1){
            this.curItemFavIcon = '~/app/images/fav-solid.png';
        }else{
            this.curItemFavIcon = '~/app/images/fav-outline.png';
        }       
        
    }

    public getTemplate(item, index, items):string {
        return isLayoutOne ? "linear" : "grid";
    }

    public isItemFav(id:number):boolean{
        if(this.favtems.indexOf(id) != -1){
            return true            
        }else{            
            return false;
        }        
    }
    

    public getBG(index:number):string{

        return Funs.getColorFromIndex(index);

    }

    public onItemTap(item){
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "item": JSON.stringify( item),
                "lang": JSON.stringify( this.lang),
                "bg":   JSON.stringify(this.getBG(item.gi))
            }
          };
        this.routerExtensions.navigate(["/item/" + item.id, {
            animated: true,
            transition: {
                name: "flip", //"fade"
                duration: 580,
                curve: "easeIn"
            
            }
          }
          ], navigationExtras);
        
    }
}