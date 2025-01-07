import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordValidation', async: false })
export class PasswordValidation implements ValidatorConstraintInterface {
  private errors: string[] = [];

  validate(password: string): boolean {
    this.errors = []; // clean array before

    if (password.length === 0) {
      this.errors.push('Password can not be empty!');
    }

    // check for white spaces
    if (/\s/.test(password)) {
      this.errors.push('Password can not contain white spaces');
    }

    // Min length
    if (password.length < 6) {
      this.errors.push('Password must be at least 6 characters!');
    }

    // Max length
    if (password.length > 20) {
      this.errors.push('Password must be at most 20 characters long!');
    }

    // At least one upper case character
    if (!/[A-Z]/.test(password)) {
      this.errors.push('Password must contain at least one uppercase letter!');
    }

    // At least one lower case character
    if (!/[a-z]/.test(password)) {
      this.errors.push('Password must contain at least one lowercase letter!');
    }

    // At least one digit
    if (!/\d/.test(password)) {
      this.errors.push('Password must contain at least one digit!');
    }

    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password)) {
      this.errors.push('Password must contain at least one special character!');
    }

    // Latin letters and special characters
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]+$/.test(password)) {
      this.errors.push(
        'Password can contain only latin letters, digit and special characters!',
      );
    }

    // return false if errors
    return this.errors.length === 0;
  }

  defaultMessage(): string {
    // return all error as string
    return this.errors.length ? this.errors.join(', ') : 'Password is weak!';
  }
}
