export interface Role {
  id: string;
  roleCode: string;
  roleDescription: string;
  authority: 'USER' | 'ADMIN';
}

export interface RoleRequestDto {
  roleCode: string;
  roleDescription: string;
  authority: 'USER' | 'ADMIN';
}

export interface RoleResponse {
  message: string;
}
