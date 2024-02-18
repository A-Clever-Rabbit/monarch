import {Meteor} from 'meteor/meteor';
import {ZodError} from 'zod'

export class ValidationError extends Meteor.Error {
  static code = 'validation-error';
  static message = 'Validation failed';

  constructor(error: ZodError, message = ValidationError.message) {
    // @ts-ignore because Meteor's Error constructor can take an array / object as the third argument
    super(ValidationError.code, message, error);
  }
}
