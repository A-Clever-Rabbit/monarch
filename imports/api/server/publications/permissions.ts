import {subscriptionBuilder} from '/imports/api/lib/subscription-builder'
import {registerPublications} from '/imports/api/lib/register-publications'
import {locate} from '/imports/service-registry/locator'
import {IPermissionsPublication} from '/imports/application/dto/permissions/publication'
import {z} from 'zod'

const permissionsPublications = {
  "permissions.search": subscriptionBuilder({
    input: z.object({
      roleType: z.enum(["user", "member"]),
      search: z.string().optional()
    }).strip(),
    run(args) {
      locate<IPermissionsPublication>("application/dto/permissions/publication")
        .call(this, args);
    }
  }),
} as const

export type PermissionsPublications = typeof permissionsPublications

registerPublications(permissionsPublications)
