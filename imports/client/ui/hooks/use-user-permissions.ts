import {useMethodQuery} from "@/hooks/api";

export function useUserPermissions(permissionName: string) {
  const { data: permission, isLoading } = useMethodQuery("users.userHasPermission", { permissionName });
  return isLoading || !!permission;
}
