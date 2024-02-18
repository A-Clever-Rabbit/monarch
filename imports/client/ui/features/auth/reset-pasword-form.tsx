import React, {ComponentProps} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {z} from 'zod'
import {toFormikValidationSchema} from 'zod-formik-adapter'
import {FormStatus} from "@/components/lib/form-status";
import {Button} from "@/components/button";

const ResetPasswordSchema = z.object({
  password: z.string(),
  confirmPassword: z.string()
});

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>

const _initialValues: ResetPasswordValues = {
  password: "",
  confirmPassword: ""
}

type ResetPasswordFormProps = Omit<ComponentProps<typeof Formik<ResetPasswordValues>>, "initialValues"> & { initialValues?: Partial<ResetPasswordValues> }
export const ResetPasswordForm = ({ initialValues, ...rest }: ResetPasswordFormProps) => {
  return (
    <Formik<ResetPasswordValues>
      initialValues={Object.assign({}, _initialValues, initialValues)}
      validateOnMount
      validationSchema={toFormikValidationSchema(ResetPasswordSchema)}
      {...rest}
    >
      {({ isValid, isSubmitting, values }) => (<Form>
        <FormStatus className="pb-2 text-error" />
        <div className="mb-4">
          <Field
            type="password"
            name="password"
            className="w-full p-2 border border-solid bg-background border-border rounded-[4px]"
            placeholder="Password"
          />
          <ErrorMessage
            name="password"
            component="div"
            className="pt-2 text-error"
          />
        </div>

        <div className="mb-4">
          <Field
            type="password"
            name="confirmPassword"
            className="w-full p-2 border border-solid bg-background border-border rounded-[4px]"
            placeholder="Confirm Password"
          />
          <ErrorMessage
            name="confirmPassword"
            component="div"
            className="pt-2 text-error"
          />
          {(values.password !== values.confirmPassword) && <div>
            <div className="pt-2 text-error">Passwords do not match</div>
          </div>}
        </div>

        <Button
          disabled={!isValid || isSubmitting || (values.password !== values.confirmPassword)}
          type="submit"
          className="bg-primary text-primary-foreground py-2 px-4 rounded-[4px] w-full font-semibold text-base flex flex-col items-center justify-center mb-4"
        >
          Send password reset email
        </Button>
      </Form>)}
    </Formik>
  );
}
