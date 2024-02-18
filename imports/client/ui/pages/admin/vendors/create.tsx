import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {useMethodMutation} from '@/hooks/api'
import {FormBlock} from "@/features/menu/item/item-form";
import {VendorForm} from "@/features/vendors/vendor-form";
import { ErrorMessageDialog } from '../../../components/alert-dialog';

function CreateVendorPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  
  const createVendorMutation = useMethodMutation('vendor.create', {
    onSuccess: (vendorId) => {
      navigate(`/admin/vendors/edit/${vendorId}`);
    },
    onError: (error) => {
      setError(error.reason as string);   
    }
  });

  return <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
    <div className="flex justify-between px-6 py-6">
      <p className="text-lg font-bold capitalize">Create New Vendor</p>
    </div>

    <div className="px-6 mb-2">
      <FormBlock>
        <VendorForm
          onSubmit={(values) => createVendorMutation.mutate(values)}
        />
      </FormBlock>
    </div>

    <ErrorMessageDialog
      open={!!error}
      onOpenChange={() => setError(undefined)}
      title={"Authorization Error"}
      message={error}
    />      
  </div>
}

export default CreateVendorPage;
