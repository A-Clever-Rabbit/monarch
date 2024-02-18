import React from 'react'
import {Link, useParams} from 'react-router-dom'
import {useRoles} from '/imports/client/ui/features/roles-and-permissions/use-roles-and-permissions'
import {Button} from '/imports/client/ui/components/button'
import {RolesColumns} from "/imports/client/ui/features/roles-and-permissions/roles-columns";
import {DataTable} from '/imports/client/ui/components/data-table'
import {RoleType} from '/imports/domain/entities/role/role'

const AdminRoles$typeRolesPage = () => {
  //Quick fix
  let { type } = useParams<{ type: RoleType | "staff" }>();

  if(!type) throw new Error("roleType is required");

  //Quick fix
  if (type === "staff") {
    type = "member"
  }

  const [_, roles] = useRoles({ type });

  return <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
    <div className="flex justify-between px-6 py-6">
      <p className="text-muted-foreground text-lg font-bold capitalize">{type === "member" ? "Staff":type} Roles</p>

      <Button
        type={"button"}
        asChild
        variant={"defaultBlue"}>
        <Link to={`/admin/roles/${type === "member" ? "staff":type}/create`}>
          Create&nbsp;<span className="capitalize">{type === "member" ? "Staff":type}</span>&nbsp;Role
        </Link>
      </Button>
    </div>

    <div className="px-6">
      {roles && <DataTable columns={RolesColumns} data={roles} />}
    </div>
  </div>
}

export default AdminRoles$typeRolesPage
