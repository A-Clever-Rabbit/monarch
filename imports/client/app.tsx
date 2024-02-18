import React, {Suspense} from 'react';

import { RouterProvider } from "react-router-dom";

import router from '/imports/client/router'
import {AuthProvider} from '/imports/client/ui/components/user'

import {QueryClient, QueryClientProvider} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import {Toaster} from "@/components/toaster";
import {AppThemeToggle} from '@/features/app/theme-toggle/app-theme-toggle'
import PageLoadingAnimation from '@/components/page-loading-animation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})
export const App = () => {
  return <Suspense fallback={<PageLoadingAnimation />}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

    <AppThemeToggle />
  </Suspense>
}
