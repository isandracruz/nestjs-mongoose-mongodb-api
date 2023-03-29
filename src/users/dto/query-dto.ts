import { Transform } from 'class-transformer';
import { IsDateString } from 'class-validator';
import * as moment from "moment";

export class QueryDto {  

  @Transform(({ value }) => { 
    return moment(new Date(String(value))).startOf('date').format();
  })
  @IsDateString()    
  public dateStart: string;

  @Transform(({ value }) => { 
    return moment(new Date(String(value))).endOf('date').format();
  })
  @IsDateString()    
  public dateEnd: string;
}