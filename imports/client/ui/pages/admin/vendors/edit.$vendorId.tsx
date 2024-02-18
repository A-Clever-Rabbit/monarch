import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import {useMethodMutation} from '@/hooks/api'
import {Button} from "@/components/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/dialog";
import {Form} from 'formik'
import {DialogClose} from '@radix-ui/react-dialog'
import {toast} from '@/components/ui/use-toast'
import {FormBlock} from "@/features/menu/item/item-form";
import {VendorForm} from "@/features/vendors/vendor-form";
import {VendorUOMFormInputs, VendorUOMFormProvider} from "@/features/vendors/vendor-uom-form";
import {VendorUOMDataTable} from "@/features/vendors/vendor-uom-data-table";
import {useVendor, useVendorUOMWithVendorAndItemAndUOM} from "@/features/vendors/use-vendors";
import { ErrorMessageDialog } from '../../../components/alert-dialog';

function EditVendorPage() {
  const { vendorId } = useParams<{ vendorId: string }>();

  if (!vendorId) {
    throw new Error("vendorId is required");
  }

  const [showAddVendorUOMModal, setShowAddVendorUOMModal] = useState(false);
  const [, vendorUOMs] = useVendorUOMWithVendorAndItemAndUOM();
  const [loading, vendor] = useVendor({ vendorId });
  const [error, setError] = useState<string>();

  const updateVendorMutation = useMethodMutation('vendor.update', {
    onError: (error) => { 
      setError(error.reason as string);
    }
  });

  const createVendorUOMMutation = useMethodMutation('vendor.createUOM', {
    onSuccess: () => setShowAddVendorUOMModal(false),
    onError: (error) => void toast({ title: error.error.toString(), description: error.reason })
  });

  if (loading) return <div>Loading...</div>

  return <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
    <div className="flex justify-between px-6 py-6">
      <p className="text-muted-foreground text-lg font-bold">Edit Vendor</p>
    </div>

    <div className="px-6 mb-2 flex flex-col gap-4">
      <FormBlock title="Vendor Details">
        <VendorForm
          initialValues={vendor}
          onSubmit={update => updateVendorMutation.mutate({
            vendorId,
            update
          })}
        />
      </FormBlock>

      <div className="bg-background px-4 py-6 border-border-foreground border rounded-sm mb-4">
        <div className="flex justify-between items-center pb-2">
          <span className="block text-sm text-muted-foreground font-semibold mb-2">Products</span>
          <Button type="button" onClick={() => setShowAddVendorUOMModal(true)} size={"sm"}>Add Vendor UOM</Button>
        </div>

        {showAddVendorUOMModal && <Dialog open={showAddVendorUOMModal} onOpenChange={setShowAddVendorUOMModal}>
          <DialogHeader className="mb-4">
            <DialogTitle>New Vendor UOM</DialogTitle>
          </DialogHeader>

          <DialogContent className="max-w-[625px]">
            <VendorUOMFormProvider
              initialValues={{vendorId: vendorId!}}
              onSubmit={newVendorUOM => createVendorUOMMutation.mutate(newVendorUOM)}>
              {(props) => {
                return <Form>
                  <DialogHeader className="mb-4">
                    <DialogTitle>New Vendor UOM</DialogTitle>
                  </DialogHeader>

                  <div>
                    <VendorUOMFormInputs />
                  </div>


                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button">Cancel</Button>
                    </DialogClose>

                    <Button
                      disabled={!props.isValid || !props.dirty || props.isSubmitting}
                      type="submit"
                      variant={"defaultBlue"}>
                      Create
                    </Button>
                  </DialogFooter>
                </Form>
              }}
            </VendorUOMFormProvider>
          </DialogContent>
        </Dialog>}

        <VendorUOMDataTable data={vendorUOMs} />
      </div>
    </div>

    <ErrorMessageDialog
      open={!!error}
      onOpenChange={() => setError(undefined)}
      title={"Authorization Error"}
      message={error}
    />    
  </div>
}

export default EditVendorPage;
