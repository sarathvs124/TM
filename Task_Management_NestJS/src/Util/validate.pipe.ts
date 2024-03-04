import { CustomValidation } from './custom-validation.schema';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  transform(value: Record<string, any>) {
    if (typeof value === typeof {}) {
      const { error } = this.schema.validate(value);
      if (error) {
        console.log('========================');
        console.log(error.message);
        let responseObj: CustomValidation;
        if (error.details[0].type == 'object.unknown') {
          responseObj = new CustomValidation(error.details[0].type);
        } else {
          responseObj = new CustomValidation(error.message);
        }
        throw new BadRequestException(responseObj);
      }
      return value;
    } else {
      return value;
    }
  }
}
