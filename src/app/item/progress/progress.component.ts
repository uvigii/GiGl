import { AfterViewInit, Component, Input, OnInit } from "@angular/core"; // tslint:disable-line:max-line-length
import { Funs } from '~/app/shared/funs';

@Component({
    selector: "ProgressRating",
    templateUrl: "./progress.component.html",
    styleUrls: ["./progress.component.css"]
})
export class ProgressComponent implements AfterViewInit, OnInit {


    @Input() index: number;
    @Input() name:  string ="";
    
    public gi_columns: string = "50*,50*";
    public gi_color: string = "white";

    ngAfterViewInit(): void {
        
        //this.gi_columns = this.item.gi + "*," + (100 - this.item.gi) + "*";
        //console.dir(this.item);
    }

    ngOnInit(): void {
        this.gi_columns = this.index + "*," + (100 - this.index) + "*";
        let percent = 0;
        let intervalId = setInterval(() => {   
            this.gi_color = Funs.getColorFromIndex(percent);         
            percent++;
                if (percent > this.index) {
                    clearInterval(intervalId);
                }
        }, 20);
    } 

}
