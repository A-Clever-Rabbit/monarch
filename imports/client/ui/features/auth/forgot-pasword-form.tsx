import React, {ComponentProps} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {z} from 'zod'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {Button} from "@/components/button";

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>

const _initialValues: ForgotPasswordValues = {
  email: ""
}

type ForgotPasswordFormProps = Omit<ComponentProps<typeof Formik<ForgotPasswordValues>>, "initialValues"> & { initialValues?: Partial<ForgotPasswordValues> }
export const ForgotPasswordForm = ({ initialValues, ...rest }: ForgotPasswordFormProps) => {
  return (
    <Formik<ForgotPasswordValues>
      initialValues={Object.assign({}, _initialValues, initialValues)}
      validationSchema={toFormikValidationSchema(ForgotPasswordSchema)}
      {...rest}
    >
      <Form>
        <div className="mb-4">
          <Field
            type="email"
            id="email"
            name="email"
            className="w-full p-2 border border-solid bg-background border-border rounded-[4px]"
            placeholder="Email"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="pt-2 text-error"
          />
        </div>

        <Button
          type="submit"
          className="bg-primary text-primary-foreground py-2 px-4 rounded-[4px] w-full font-semibold text-base flex flex-col items-center justify-center mb-4"
        >
          Send password reset email
        </Button>
      </Form>
    </Formik>
  );
}
