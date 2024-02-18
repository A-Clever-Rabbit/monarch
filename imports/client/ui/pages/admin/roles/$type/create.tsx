import React from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {RoleForm} from "/imports/client/ui/features/roles-and-permissions/role-form";
import {useMethodMutation} from '@/hooks/api'
import {RoleType} from "/imports/domain/entities/role/role";

const AdminRoles$typeCreatePage = () => {
  const { type } = useParams<{ type: RoleType | "staff" }>();
  if(!type) throw new Error("roleType is AdminRoles$typeCreatePage");

  const navigate = useNavigate();

  const createRoleMutation = useMethodMutation("roles.create", {
    onSuccess: () => {
      navigate(`/admin/roles/${type}`);
    }
  });

  return <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
    <div className="flex justify-between px-6 py-6">
      <p className="text-lg font-bold capitalize">Create New {type} Role</p>
    </div>

    <div className="px-6">
      <RoleForm
        roleType={type === "staff" ? "member":type}
        onSubmit={async (role) => {
          createRoleMutation.mutate({ type: type === "staff" ? "member":type, ...role });
        }}
      />
    </div>

  </div>
}

export default AdminRoles$typeCreatePage;
