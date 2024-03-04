import { errorCodesAndMessage } from './StausCodes';

export class CustomValidation {
  constructor(key) {
    let errorDescription = { errorMessage: '', statusCode: 1 };

    if (errorCodesAndMessage[key]) {
      errorDescription.errorMessage = errorCodesAndMessage[key].errorMessage;
      errorDescription.statusCode = errorCodesAndMessage[key].statusCode;
      return errorDescription;
    } else {
      errorDescription.errorMessage = 'Unknown form data';
      return errorDescription;
    }
  }
}
