import React from 'react'
import {useMethodMutation, useMethodQuery} from "@/hooks/api";
import {toast} from "@/components/ui/use-toast";
import {BusinessSettingsForm} from "@/features/settings/business-form";
import {TaxesSettingsForm} from "@/features/settings/taxes-form";
import {FormBlock} from '@/features/menu/item/item-form'
import {
  WhatsAppSettingsFormFields,
  WhatsAppSettingsFormProvider,
  WhatsAppSettingsFormSubmitButton
} from '@/features/whatsapp/whats-app-settings-form'
import {Form} from 'formik'

const AdminSettingsGeneralIndexPage = () => {
  const appSettingsQuery = useMethodQuery("settings.getAll");

  const saveSettingsMutation = useMethodMutation('settings.create', {
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your settings have been saved.",
      })
      void appSettingsQuery.refetch();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message
      })
    }
  })

  return <div className="bg-background text-muted-foreground flex-1 h-[calc(100vh-64px)] overflow-y-scroll no-scrollbar pb-6">
    <div className="flex justify-between px-6 py-6">
      <p className="text-muted-foreground text-lg font-bold">Settings</p>
    </div>

    <div className="px-6">
      <div className="grid grid-cols-2 gap-6">
        <BusinessSettingsForm
          enableReinitialize
          onSubmit={(values) => {
            saveSettingsMutation.mutate(values);
          }}
          initialValues={appSettingsQuery.data}
        />

        <TaxesSettingsForm
          enableReinitialize
          onSubmit={(values) => {
            saveSettingsMutation.mutate(values);
          }}
          initialValues={appSettingsQuery.data}
        />

        {
          /**
           * The above are using FormBlock inside the Form component, which has since been deemed suboptimal.
           *  by separating the form from the form block, we can have more control over the form block where we use
           *  it and have more flexibility in the future.
           */
        }
        <FormBlock title={"WhatsApp"}>

          <WhatsAppSettingsFormProvider
            initialValues={appSettingsQuery.data?.whatsApp}
            enableReinitialize
            onSubmit={(values) => saveSettingsMutation.mutate({
              whatsApp: { ...values }
            })}>
            <Form>
              <WhatsAppSettingsFormFields />
              <WhatsAppSettingsFormSubmitButton className="mt-4" />
            </Form>
          </WhatsAppSettingsFormProvider>

        </FormBlock>
      </div>
    </div>
  </div>
};

export default AdminSettingsGeneralIndexPage;
