import React, {Suspense, useEffect} from 'react';
import {SideBar} from '@/features/admin'
import {AdminHeader} from '@/features/navigation/admin-header'
import {Outlet, useNavigate} from 'react-router-dom'
import {useAuth} from "@/components/user";
import {useMethodQuery} from "@/hooks/api";
import { PERMISSION_CAN_VIEW_ADMIN } from '/imports/domain/entities/permission/permission';

const AdminIndex = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isAdminQuery = useMethodQuery('permissions.byName', { name: PERMISSION_CAN_VIEW_ADMIN, roleIds: auth.user?.roleIds || [] });

  // This is a naive and temporary solution
  useEffect(() => {
    if (!isAdminQuery.isLoading) {
      if (!isAdminQuery.data) {
        navigate('/');
      }
    }
  }, [ isAdminQuery.isLoading ]);

  return <>
    <div className="flex h-screen">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <Suspense fallback={"Loading..."}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  </>
};

export default AdminIndex;
