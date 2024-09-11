import { BlobOptions } from "buffer";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, Min } from "class-validator";


export class CreateProductDto {
    @IsString()
    public nombre:string;
    @IsNumber({
        maxDecimalPlaces:4
    })
    @Min(0)
    @Type(()=>
        Number
    )
    public precio:number;

    @IsBoolean()
    public estado:boolean;
}
