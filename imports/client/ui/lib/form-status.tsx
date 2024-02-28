import {useFormikContext} from 'formik'
import React from 'react'

type FormStatusProps = {
  className?: string
}

export const FormStatus = ({ className }: FormStatusProps) => {
  const { status } = useFormikContext();
  if(typeof status === 'string') {
    return <div className={className}>{status}</div>;
  } else if (typeof status === "object" && !!status.reason) {
    return <div className={className}>{status.reason}</div>;
  }
  return null;
}
