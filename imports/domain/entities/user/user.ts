
export type UserDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  name: string
  phone?: string
  roleIds: string[]

  /**
   * Meteor fields
   */
  username?: string| undefined
  emails: UserEmail[]
  profile?: any
  services?: any
};

type UserEmail = {
  address: string
  verified: boolean
}
