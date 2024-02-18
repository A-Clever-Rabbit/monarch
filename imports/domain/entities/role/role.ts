export const ROLE_DEFAULT_USER = "DefaultUser";
export const ROLE_MAIN_ADMIN = "MainAdmin";

export type RoleDocument = {
  _id: string
  name: string
  safeName?: string
  description?: string
  permissionIds: string[]
  createdAt: Date
  updatedAt: Date
}
