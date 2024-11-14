import {
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export class AuthorGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id, type } = request.params;

    let entity;

    switch (type) {
      case 'transactions':
        break;
      case 'categoiry':
        break;
      default:
        throw new NotFoundException('Something went wrong...');
    }

    return true;
  }
}
