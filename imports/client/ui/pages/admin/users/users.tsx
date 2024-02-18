import {Meteor} from "meteor/meteor";
import React, {useCallback, useState} from "react";
import {useDebouncedValue} from "@mantine/hooks";
import {Search, X} from "lucide-react";
import {SelectableDataTable} from "@/components/selectable-data-table";
import _ from "lodash";
import {TextPill} from "@/components/text-pill";
import {Button} from "@/components/button";
import {Input} from "@/components/ui/input";
import {RoleType} from '/imports/domain/entities/role/role'
import {RoleSelectCombobox} from "@/features/roles-and-permissions/role-select-combobox";
import {RoleAssignmentModal} from "@/features/roles-and-permissions/role-assignment-modal";
import {useUsers} from "@/features/users/use-users";
import {CreateUserSheet} from "@/features/users/create-user-sheet";
import {UsersColumns} from "@/features/users/users-columns";
import {useRoles} from "@/features/roles-and-permissions/use-roles-and-permissions";

type Filters = {
  roleIds: string[]
}

const UsersView = () => {
  const [canAssignRoles, setCanAssignRoles] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState<Meteor.User[]>([]);
  const [filters, setFilters] = useState<Filters>({ roleIds: [] });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  const [, users] = useUsers({ search: debouncedSearch, roleIds: filters.roleIds });

  const assignRoles = useCallback((users) => {
    setSelectedUsers(users);
    setCanAssignRoles(users.length);
  }, []);

  return <>
    <RoleAssignmentModal roleType={"user"} open={modalOpen} onOpenChange={setModalOpen} users={selectedUsers} />

    <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
      <div className="flex justify-between px-6 py-6">
        <p className="text-muted-foreground text-lg font-bold">User Management</p>

        <div>
          <CreateUserSheet />
        </div>
      </div>

      <div>
        {debouncedSearch !== "" || filters.roleIds.length > 0
          ? <DisplayFilterPills
              type={"user"}
              search={debouncedSearch}
              roleIds={filters.roleIds}
              setSearch={setSearch}
              setFilters={setFilters}
            />
          :null
        }
      </div>

      <div className="relative">
        <div className="px-6 ">
          <div className="bg-accent px-2 py-2 rounded-t-lg">
            <div className="flex justify-between gap-4">
              <div className="flex-1 relative">
            <span className="absolute text-muted-foreground inset-y-0 left-2 flex items-center">
              <Search size={20} />
            </span>
                <Input
                  type="text"
                  value={search}
                  onChange={evt => setSearch(evt.target.value)}
                  className="w-full pl-10 pr-2 py-2 border rounded-sm"
                  placeholder="Search" />
              </div>

              <div className="shrink-0 flex">
                <Button type="button" disabled={!canAssignRoles} onClick={() => setModalOpen(true)} variant="table" className={canAssignRoles ? "cursor-pointer opacity-100":""}>Update Roles</Button>
                <RoleSelectCombobox
                  selectedRoleIds={filters.roleIds}
                  onChange={(roleId) => {
                    if (_.includes(filters.roleIds, roleId)) {
                      setFilters({ ...filters, roleIds: _.without(filters.roleIds, roleId) });
                    } else {
                      setFilters({ ...filters, roleIds: [ ...filters.roleIds, roleId ] });
                    }
                  }}
                  roleType={"user"}
                  trigger={<Button type="button" variant={"table"}>Filters</Button>}
                  contentAlignment={"end"}
                />
              </div>
            </div>
          </div>

          <SelectableDataTable
            columns={UsersColumns}
            data={users}
            onSubmit={(selectedUsers) => {
              assignRoles(selectedUsers)
            }} />
        </div>
      </div>
    </div>
  </>
}

export default UsersView;

type DisplayFilterPillsProps = {
  search: string,
  roleIds: string[],
  type: RoleType,
  setSearch: (arg: "") => void,
  setFilters: ({ roleIds }: { roleIds: string[] }) => void
}
export const DisplayFilterPills = ({ search, roleIds, type, setSearch, setFilters }: DisplayFilterPillsProps) => {
  const [loading, roles] = useRoles({ type, search: "", roleIds });

  if (loading || ((roles.length !== roleIds.length) && roleIds.length > 0)) {
    return null;
  }

  console.log(roles, roleIds);

  return <div className="px-6 py-2 mb-4">
    <div className="font-semibold text-muted-foreground mb-2">
      Currently Filtering By:
    </div>

    <div className="flex flex-wrap gap-2">
      {search && <div className="flex items-center gap-2 border rounded-full bg-background px-2 py-1">
        <TextPill label={"Name or email contains: " + search} className={"text-muted-foreground bg-foreground"} />
        <button onClick={() => setSearch("")} className="text-muted-foreground">
          <X />
        </button>
      </div>}

      {_.map(roleIds, roleId => {
        const role = _.find(roles, { _id: roleId });

        return <div key={roleId} className="flex items-center gap-2 border rounded-full bg-background px-2 py-1">
          <TextPill label={role!.name} description={role!.description} className="bg-primary text-primary-foreground" />

          <button onClick={() => setFilters({
            roleIds: _.without(roleIds, roleId)
          })} className="text-foreground hover:text-foreground">
            <X />
          </button>
        </div>
      })}
    </div>
  </div>
};
