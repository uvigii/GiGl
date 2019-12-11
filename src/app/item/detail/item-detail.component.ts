import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";


@Component({
    selector: "ns-details",
    templateUrl: "./item-detail.component.html"
})
export class ItemDetailComponent implements OnInit {
    item: any;
    lang: string;
    bg:string;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        
        this.bg = JSON.parse(this.route.snapshot.queryParams.bg);        
        this.lang = JSON.parse(this.route.snapshot.queryParams.lang);
        this.item =  JSON.parse(this.route.snapshot.queryParams.item);
        
    }
}
