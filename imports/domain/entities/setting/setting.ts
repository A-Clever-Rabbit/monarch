import {FileRefStatic} from "meteor/ostrio:files";

export type SettingDocument = {
  _id: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  theme: "dark" | "light"
  businessLogo?: FileRefStatic<any>
}
