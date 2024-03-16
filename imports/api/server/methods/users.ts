import {Meteor} from "meteor/meteor";
import {methodBuilder} from "/imports/api/lib/method-builder";
import {z} from "zod";
import { Accounts } from 'meteor/accounts-base';
import {createCheckPermissionsService} from "/imports/domain/services/permissions/check-permissions";
import {locate} from "/imports/service-registry/locator";
import {IUserRepository} from "/imports/repository/user/user";
import {IRoleRepository} from "/imports/repository/role/role";
import {IPermissionRepository} from "/imports/repository/permission/permission";


const usersRepo = () => locate<IUserRepository>("repository/user/user");
const rolesRepo = () => locate<IRoleRepository>("repository/role/role");

const permissionsRepo = () => locate<IPermissionRepository>("repository/permission/permission");

const methods = {
  'users.getUsers': methodBuilder({
    input: z.object({
      name: z.string().optional()
    }),
    run({ name }) {
      if (!this.userId) return;
      if (this.isSimulation) return;

      if (!name) return usersRepo().list().fetch();

      return usersRepo().list({
        name: { $regex: name, $options: "i" }
      }).fetch();
    }
  }),

  'users.delete': methodBuilder({
    input: z.object({
      userId: z.string()
    }),
    run({ userId }) {
      if (!this.userId) return;
      if (this.isSimulation) return;

      return usersRepo().remove(userId);
    }
  }),

  'users.create': methodBuilder({
    input: z.object({
      name: z.string(),
      roleIds: z.array(z.string()),
      email: z.string().email(),
      password: z.string(),
      phone: z.string().optional(),
    }),
    run({ name, email, password, roleIds, phone }) {
      if (!this.userId) return;
      if (this.isSimulation) return;

      const userId = Accounts.createUser({
        email,
        password
      })

      return usersRepo().update(userId, {
        roleIds,
        name,
        phone
      });
    }
  }),

  'users.update': methodBuilder({
    input: z.object({
      userId: z.string(),
      user: z.object({
        name: z.string(),
        email: z.string(),
        roleIds: z.array(z.string()),
        phone: z.string().optional()
      })
    }),
    run({ userId, user }) {
      return usersRepo().update(userId, {
        name: user.name,
        "emails.0.address": user.email,
        roleIds: user.roleIds,
        phone: user.phone
      });
    }
  }),

  'users.batchAssignRoles': methodBuilder({
    input: z.object({
      userIds: z.array(z.string()),
      roleIds: z.array(z.string())
    }),
    run({ userIds, roleIds }) {
      if (this.isSimulation) return;
      usersRepo().collection().update({ _id: { $in: userIds } }, { $set: { roleIds } }, { multi: true });
    }
  }),

  'users.sendPasswordResetEmail': methodBuilder({
    input: z.object({
      email: z.string()
    }),
    run({ email }) {
      const userId = Accounts.findUserByEmail(email)?._id;
      if (!userId) {
        throw new Error(`User with email: '${email}' not found`);
      }
      Accounts.sendResetPasswordEmail(userId, email);
    }
  }),

  'users.userHasPermission': methodBuilder({
    input: z.object({
      permissionName: z.string()
    }),
    run({ permissionName }) {
      const checkPermissionsService = createCheckPermissionsService({
        permissionsRepo: permissionsRepo(),
        rolesRepo: rolesRepo(),
        userRepository: usersRepo()
      });

      return checkPermissionsService.userHasPermission(this.userId, permissionName)
    }
  })

} as const;

export type UserMethods = typeof methods;

Meteor.methods(methods)
