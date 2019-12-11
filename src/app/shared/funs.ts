export class Funs {

    public static getColorFromIndex(index:number): string{

            return ( "rgb("+ Math.floor(2.55*index) + ","+ (200 - (2 *index )) + "," + (100 - (1 * index)) + ")")

    }

}