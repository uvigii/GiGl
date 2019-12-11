import { AfterViewInit, Component, Input,Injectable } from "@angular/core"; // tslint:disable-line:max-line-length
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Funs } from '~/app/shared/funs';


@Component({
    selector: "PieChart",
    templateUrl: "./pie.component.html",
    styleUrls: ["./pie.component.css"]
})
@Injectable()
export class PieComponent implements AfterViewInit {


    @Input() item: any;
    @Input() size: number;
    @Input() showLegend: boolean;
    
    public items: ObservableArray<any> = new ObservableArray([{Ingredient: "protein", Percentage:2}]);

    ngAfterViewInit(): void {
        let other = (100 -(this.item.protein +this.item.carb + this.item.fat ));
        if (other < 0 ){ other = 1;}
        this.items = new ObservableArray([
                        {Ingredient: "protein", Percentage: this.item.protein},
                        {Ingredient: "carb", Percentage: this.item.carb},
                        {Ingredient: "fat", Percentage: this.item.fat},
                        {Ingredient: "other", Percentage: other}
                        ]            
            );
        
    }

}
