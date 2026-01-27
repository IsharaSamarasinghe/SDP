import { SetMetadata } from '@nestjs/common';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export function Auth(...roles: string[]) {
    if (roles.length > 0) {
        return applyDecorators(
            UseGuards(AuthGuard('jwt'), RolesGuard),
            Roles(...roles),
        );
    }
    return applyDecorators(UseGuards(AuthGuard('jwt')));
}
