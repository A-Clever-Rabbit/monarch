
export type ClientActionDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date

  userId: string
  payload:
    | { type: "navigate", url: string }
}
