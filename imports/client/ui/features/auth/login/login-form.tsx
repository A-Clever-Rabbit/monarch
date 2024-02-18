import React, {ComponentProps} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {z} from 'zod'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {FormStatus} from "@/components/lib/form-status";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(24, "Password must be between 3 and 24 characters")
})

type LoginValues = z.infer<typeof LoginSchema>

const _initialValues: LoginValues = {
  email: "",
  password: ""
}

type LoginFormProps = Omit<ComponentProps<typeof Formik<LoginValues>>, "initialValues"> & { initialValues?: Partial<LoginValues> }
export const LoginForm = ({ initialValues, ...rest }: LoginFormProps) => {
  return (
    <Formik<LoginValues>
      initialValues={Object.assign({}, _initialValues, initialValues)}
      validationSchema={toFormikValidationSchema(LoginSchema)}
      {...rest}
    >
      <Form>
        <FormStatus className="pb-2 text-error" />
        <div className="mb-4">
          <Field
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border border-solid bg-background text-muted-foreground border-border rounded-[4px]"
            placeholder="Email"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="pt-2 text-error"
          />
        </div>
        <div className="mb-4">
          <Field
            type="password"
            id="password"
            name="password"
            className="w-full p-2 border border-solid bg-background text-muted-foreground border-border rounded-[4px]"
            placeholder="Password"
          />
          <ErrorMessage
            name="password"
            component="div"
            className="pt-2 text-error"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-primary-foreground py-4 px-4 rounded-[4px] w-full font-semibold text-base flex flex-col items-center justify-center mb-4"
        >
          Login
        </button>
      </Form>
    </Formik>
  );
}
