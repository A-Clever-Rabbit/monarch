export const PERMISSION_CAN_POST_ADMIN = "can-view-admin-posts";
export const PERMISSION_CAN_VIEW_ADMIN = "can-view-admin";

export type PermissionDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  name: string
  description: string
}
