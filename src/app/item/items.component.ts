import { Component, OnInit } from "@angular/core";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ItemService } from "../shared/item.service";
import { BackendService } from "../shared/backend.service";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { RadListView, ListViewGridLayout, ListViewLinearLayout } from "nativescript-ui-listview";


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
    public isLayoutOne: boolean = false;
    public curItemFavIcon: string = "~/app/images/fav-outline.png"; 

    constructor(private itemService: ItemService, private bs: BackendService) {     
            this.items = new ObservableArray();
            this.favtems = bs.getFavorite();
            this.lang = bs.getLang();
            this.queryItems("");                      
    }

    ngOnInit(): void {
        //this.items = this.itemService.getItems();
    }        
    
    public onTextChanged(args) {
        let searchBar = <SearchBar>args.object;
        console.log("SearchBar text changed! New value: " + searchBar.text);
        if (searchBar.text) {
            this.queryItems(searchBar.text);                        
        }
        
    }

    public queryItems(key:string){

        this.bs.searchItems(key, this.isFavourite ? "" : "").then((res) => {                    
            this.items = new ObservableArray(res);                   
        })
        .catch((err) => {
            console.log(err.message); // something bad happened
        });  

    }

    public onClear(args) {
        let searchBar = <SearchBar>args.object;
        searchBar.text = "";
        this.queryItems("");
    }

    public onFavItemTap(args){
        
        if(this.favtems.indexOf(args.object.bindingContext.id) != -1){
            this.favtems.splice(this.favtems.indexOf(args.object.bindingContext.id),1);            
        }else{            
            this.favtems.push(args.object.bindingContext.id);
        }        
        this.bs.setFavorite(this.favtems);
        this.queryItems("");
    }

    public onFavoriteTap(args) {
        const image = args.object;
        this.isFavourite = ! this.isFavourite;
        if ( ! this.isFavourite){
            image.src = "~/app/images/fav-outline.png";
        }else{
            image.src = "~/app/images/fav-solid.png";
        }
        console.dir(this.isFavourite);
        /*
        const image = args.object;
        //const listView = <RadListView>image.page.getViewById("list-view");
        const itemData = image.bindingContext;
        if (itemData.favourite) {
            image.src = "~/app/images/fav-outline.png";
            itemData.favourite = false;
        } else {
            image.src = "~/app/images/fav-solid.png";
            itemData.favourite = true;
        }

        //listView.notifySwipeToExecuteFinished();
        */
    }

    public onLayoutTap(args){
        const image = args.object;
        const listView = <RadListView>image.page.getViewById("list-view");

        this.isLayoutOne = ! this.isLayoutOne;
        if ( this.isLayoutOne){
            listView.swipeActions = true;
            let Layout = new ListViewLinearLayout();
            listView.listViewLayout =  Layout;
            image.src = "~/app/images/layout-linear.png";
        }else{
            listView.swipeActions = false;
            let Layout = new ListViewGridLayout();
            listView.listViewLayout =  Layout;
            image.src = "~/app/images/layout-grid.png";
        }
        
        console.dir(this.isLayoutOne);
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
    
}