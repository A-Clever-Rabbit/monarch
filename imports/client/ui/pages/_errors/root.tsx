import {isRouteErrorResponse, useRouteError} from 'react-router-dom'
import React from 'react'
import NotFoundPage from '@/pages/not-found'

export default function RootError() {
  const error = useRouteError();

  if(isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return <pre>
    {(error as Error).stack}
  </pre>
}
