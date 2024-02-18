import React, {createContext, Dispatch, PropsWithChildren, useContext, useMemo, useReducer} from 'react'
import {Meteor} from 'meteor/meteor'
import {useTracker} from 'meteor/react-meteor-data'
import _ from 'lodash'

import {PermissionDocument} from '/imports/domain/entities/permission/permission'

type User = Pick<Meteor.User, "emails" | "roleIds" | "_id"> & {
  permissions: Record<string, PermissionDocument>
}

// https://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword
type LoginSelector = string | { email: string } | { username: string } | { _id: string }

type AuthState = {
  loggingIn: boolean
  loggingOut: boolean
  user: User | null
}
type AuthAction =
  | { type: "loggingIn" }
  | { type: "loggedIn", user: User }
  | { type: "loggingOut" }
  | { type: "loggedOut" }
const init = (initialState?: Partial<AuthState>): AuthState => (Object.assign({
  user: null,
  loggingIn: false,
  loggingOut: false
}, initialState))
const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "loggingIn":
      return { ...state, loggingIn: true };
    case "loggedIn":
      return { ...state, loggingIn: false, user: action.user };
    case "loggingOut":
      return { ...state, loggingOut: true };
    case "loggedOut":
      return { ...state, loggingOut: false, user: null };
    default:
      return state;
  }
}

const useAuthAPI = (state: AuthState, dispatch: Dispatch<AuthAction>) => {
  return useMemo(() => ({
    ...state,
    hasPermission(permissionId: string) {
      return !!state.user?.permissions[permissionId];
    },
    loginWithPassword: (user: LoginSelector, password: string) => {
      dispatch({ type: "loggingIn" });
      return new Promise<void>((resolve, reject) =>
        Meteor.loginWithPassword(user, password, async (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }));
    },
    logout: () => {
      dispatch({ type: "loggingOut" });
      return new Promise<void>((resolve, reject) =>
        Meteor.logout((error) => {
          if (error) {
            reject(error);
          } else {
            dispatch({ type: "loggedOut" });
            resolve();
          }
        }));
    }
  }), [ state, dispatch ]);
}

type AuthAPI = ReturnType<typeof useAuthAPI>

const AuthContext = createContext<AuthAPI | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

type AuthProviderProps = PropsWithChildren<{
  initialState?: Partial<AuthState>
}>
export const AuthProvider = ({ children, initialState }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, init(initialState));
  const api = useAuthAPI(state, dispatch);

  // This tracker keeps the AuthContext up to date with Meteor's reactive source for user session data.
  // Could be convoluted: TODO - investigate
  useTracker(() => {
    if (Meteor.loggingOut()) {
      dispatch({ type: "loggingOut" });
    }
    if (Meteor.loggingIn()) {
      dispatch({ type: "loggingIn" });
    }
    if(!Meteor.userId()) {
      dispatch({ type: "loggedOut" });
    } else {
      loadUser().then(user => {
        if(user) {
          dispatch({ type: "loggedIn", user });
        } else {
          dispatch({ type: "loggedOut" });
        }
      });
    }
  }, []);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

type OrderFormConsumerProps = {
  children: (api: AuthAPI) => React.ReactNode
}
export const AuthConsumer = ({ children }: OrderFormConsumerProps) => {
  const context = useAuth();
  return <>{children(context)}</>;
}

/**
 * CAN ONLY BE RUN AFTER SUBSCRIBING TO userData. This function is used to get the user from the Meteor.user() object.
 */
const getUser = (): User | null => {
  const meteorUser = Meteor.user();
  // const permissionsService = locate<TPermissionsService>(ServiceSymbols.Permissions);

  const userPermissions: PermissionDocument[] = [];

  // for(const roleId of meteorUser?.roleIds || []) {
  //   userPermissions.push(...permissionsService.getPermissionByRole(roleId));
  // }

  let user = null;
  if(meteorUser) {
    user = {
      ...meteorUser,
      permissions: _.keyBy(userPermissions, 'id')
    }
  }

  return user;
}

export const loadUser = async () => {
  return new Promise<User | null>((resolve, reject) => {
    Meteor.subscribe("userData", {
      onReady: () => {
        resolve(getUser());
      },
      onStop: (error: Meteor.Error | undefined) => {
        if(error) {
          reject(error);
        }
      }
    })
  });
}
