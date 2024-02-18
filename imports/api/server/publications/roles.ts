import {subscriptionBuilder} from '/imports/api/lib/subscription-builder'
import {registerPublications} from '/imports/api/lib/register-publications'
import {z} from 'zod'
import {locate} from "/imports/service-registry/locator";
import {IRolesPublication} from "/imports/application/dto/roles/roles-publication";
import {RoleType} from "/imports/domain/entities/role/role";

const rolesPublication = {
  roles: subscriptionBuilder({
    input: z.object({
      search: z.string().optional(),
      type: z.string(),
      roleIds: z.array(z.enum(["user", "member"])).optional(),
      limit: z.number().optional()
    }),
    run({ search, roleIds, type, limit }) {
      let roleType = type as RoleType;
      locate<IRolesPublication>("application/dto/roles/roles-publication").call(this, { search, roleIds, type: roleType, limit });
    }
  })
} as const

export type RolesPublications = typeof rolesPublication

registerPublications(rolesPublication)

