import { JoiValidationPipe } from '../validate.pipe';
import { ObjectSchema } from 'joi';
import { BadRequestException } from '@nestjs/common';

describe('JoiValidationPipe', () => {
  let pipe: JoiValidationPipe;
  let schema: ObjectSchema;

  beforeEach(() => {
    schema = {} as ObjectSchema;
    pipe = new JoiValidationPipe(schema);
  });

  describe('transform', () => {
    it('should throw BadRequestException when validation fails', () => {
      // Mock the validation error
      const error = new Error('Validation error');
      error['details'] = [{ type: 'test' }];
      error['message'] = 'Validation error';
      error['isJoi'] = true;

      // Mock the schema.validate method to return the validation error
      schema.validate = jest.fn().mockReturnValueOnce({ error });

      // Test the pipe
      expect(() => pipe.transform({ test: 'invalid value' })).toThrow(
        BadRequestException,
      );
    });
  });
});
