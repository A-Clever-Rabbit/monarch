import React, {useCallback, useState} from "react";
import {useDebouncedValue} from "@mantine/hooks";
import {Search} from "lucide-react";
import {SelectableDataTable} from '@/components/selectable-data-table'
import {cn} from "@/components/lib/utils";
import {DisplayFilterPills} from "@/pages/admin/users/users";
import _ from "lodash";
import {Button} from "@/components/button";
import {Input} from "@/components/ui/input";
import {MemberDocument} from '/imports/domain/entities/member/member'
import {RoleAssignmentModal} from "@/features/roles-and-permissions/role-assignment-modal";
import {CreateMemberSheet} from "@/features/members/create-member-sheet";
import {RoleSelectCombobox} from "@/features/roles-and-permissions/role-select-combobox";
import {MembersColumns} from "@/features/members/members-columns";
import {useMembers} from "@/features/members/use-members";

type Filters = {
  roleIds: string[]
}

const MemberView = () => {
  const [canAssignRoles, setCanAssignRoles] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<MemberDocument[]>([]);

  const [filters, setFilters] = useState<Filters>({ roleIds: [] });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  const [, members] = useMembers({ search: debouncedSearch });

  const assignRoles = useCallback((members) => {
    setSelectedMembers(members);
    setCanAssignRoles(members.length);
  }, []);

  return <>
    <RoleAssignmentModal
      roleType={"member"}
      open={modalOpen}
      onOpenChange={setModalOpen}
      users={selectedMembers}
    />

    <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
      <div className="flex justify-between px-6 py-6">
        <p className="text-muted-foreground text-lg font-bold">Staff Management</p>

        <div>
          <CreateMemberSheet />
        </div>
      </div>

      <div>
        {debouncedSearch !== "" || filters.roleIds.length > 0
          ? <DisplayFilterPills
            type={"member"}
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
            <span className="absolute inset-y-0 left-2 flex items-center">
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
                <Button
                  type={"button"}
                  variant={"table"}
                  disabled={!canAssignRoles}
                  onClick={() => setModalOpen(true)}
                  className={cn("font-semibold px-3 py-2 mr-1 border rounded-sm opacity-30", canAssignRoles && "cursor-pointer opacity-100")}>
                  Assign Roles
                </Button>
                <RoleSelectCombobox
                  selectedRoleIds={filters.roleIds}
                  onChange={(roleId) => {
                    if (_.includes(filters.roleIds, roleId)) {
                      setFilters({ ...filters, roleIds: _.without(filters.roleIds, roleId) });
                    } else {
                      setFilters({ ...filters, roleIds: [ ...filters.roleIds, roleId ] });
                    }
                  }}
                  roleType={"member"}
                  trigger={<Button type="button" variant={"table"}>Filters</Button>}
                  contentAlignment={"end"}
                />
              </div>
            </div>
          </div>

          <SelectableDataTable
            columns={MembersColumns}
            data={members}
            onSubmit={(selectedUsers) => {
              assignRoles(selectedUsers)
            }}
          />
        </div>
      </div>
    </div>
  </>
}

export default MemberView;
