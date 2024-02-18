import React from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {RoleForm} from '/imports/client/ui/features/roles-and-permissions/role-form'
import {useMethodMutation, useMethodQuery} from '@/hooks/api'
import {RoleType} from '/imports/domain/entities/role/role'

const AdminRoles$typeEditPage = () => {
  let { roleId, type } = useParams<{ roleId: string, type: RoleType | "staff" }>();

  if(!roleId) throw new Error("roleId is required in AdminRoles$typeEditPage");
  if(!type) throw new Error("roleType is required in AdminRoles$typeEditPage");

  //Quick fix
  if (type === "staff") {
    type = "member"
  }

  const navigate = useNavigate();

  const { data: role, refetch: refetchRole } = useMethodQuery('roles.get', { roleId });
  const updateRoleMutation = useMethodMutation('roles.update', {
    onSuccess: () => {
      void refetchRole();
      navigate(`/admin/roles/${type}`);
    }
  });

  return <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
    <div className="flex justify-between px-6 py-6">
      <p className="text-lg font-bold capitalize">Edit {type} Role</p>
    </div>

    <div className="px-6">
      {role &&
        <RoleForm
          enableReinitialize
          initialValues={role}
          roleType={type}
          onSubmit={(update) => {
            updateRoleMutation.mutate({ roleId: roleId!, update });
          }}
        />
      }
    </div>
  </div>
}

export default AdminRoles$typeEditPage;
