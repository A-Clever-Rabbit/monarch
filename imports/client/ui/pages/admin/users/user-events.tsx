import React from 'react';
import {DataTable} from '@/components/data-table'
import {useUsersEventLog} from "@/features/users/use-users-event-log";
import {UserEventsColumns} from "@/features/users/user-events-columns";

const UserEvents = () => {

  const [,userEvents] = useUsersEventLog({});

  return (
    <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
      <div className="flex justify-between px-6 py-6 mb-3">
        <p className="text-muted-foreground text-lg font-bold">User Events Audit Trail</p>

        <div></div>
      </div>


      <div className="px-6">
        {userEvents && <DataTable columns={UserEventsColumns} data={userEvents} />}
      </div>
    </div>
  );
};

export default UserEvents;
