import { Pipe, PipeTransform } from '@angular/core';
import {IMiniPipe} from "../../interfaces/resolucao.interface";

@Pipe({
  name: 'isMini',
  pure: true
})
export class IsMiniPipe implements PipeTransform {

  private readonly minResBase = 360;

  transform(value: IMiniPipe | null | undefined): boolean {
    if (!value || !value.width) return false;

    return value.width <= this.minResBase;
  }
}
