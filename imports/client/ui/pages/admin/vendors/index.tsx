import React, {useState} from "react";
import {Search} from 'lucide-react'
import {Button} from '@/components/button'
import {Link} from 'react-router-dom'
import {Input} from "@/components/ui/input";
import {useVendors} from "@/features/vendors/use-vendors";
import {VendorListDataTable} from "@/features/vendors/vendor-list-data-table";
function VendorsPage() {
  const [search, setSearch] = useState("");
  const [, vendors] = useVendors({ search });

  return <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
    <div className="flex justify-between px-6 py-6">
      <p className="text-muted-foreground text-lg font-bold">Vendors</p>

      <Button type="button" asChild>
        <Link to="/admin/vendors/create">Add Vendor</Link>
      </Button>
    </div>

    <div className="relative">
      <div className="px-6">
        <div className="bg-accent px-2 py-2 rounded-t-lg">
          <div className="flex justify-between gap-4">
            <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-2 flex items-center">
              <Search size={20} />
            </span>
              <Input
                type="text"
                value={search}
                onChange={evt => setSearch(evt.target.value)}
                className="w-full pl-10 pr-2 py-2 border rounded-sm"
                placeholder="Search" />
            </div>
          </div>
        </div>

        <VendorListDataTable data={vendors} />

      </div>
    </div>
  </div>
}

export default VendorsPage;
