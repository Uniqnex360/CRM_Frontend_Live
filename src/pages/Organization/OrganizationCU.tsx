import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import { IOrganizationCU } from "../../interfaces/organization";
import AppFormInput from "../../components/common/AppFormInput";
import { OrganizationService } from "../../services/organization";

interface OrganizationCUProps {
  isUpdate?: boolean;
  setCreateModal: (val: boolean) => void;
  fetchList: () => void;
  organizationData?: IOrganizationCU;
}

const OrganizationCU = ({
  isUpdate = false,
  setCreateModal,
  fetchList,
  organizationData,
}: OrganizationCUProps) => {
  const service = new OrganizationService();

  // loading state
  const [cudLoading, setCUDLoading] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<IOrganizationCU>(
    {
      mode: "onSubmit",
      defaultValues: organizationData || {},
    },
  );

  // clear form
  const clearForm = () => {
    reset();
  };

  //handle api calls
  const onSubmit = async (data: IOrganizationCU) => {
    try {
      setCUDLoading(true);
      if (!isUpdate) {
        await service.createOrganization(data);

        toast.success("Organization Created Successfully!");
      } else {
        console.log(data);
        toast.success("Organization Updated Successfully!");
      }

      clearForm();
      setCreateModal(false);
      fetchList();
    } catch (error: any) {
      console.log("API error:", error);

      // Handle Axios / fetch error formats
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setCUDLoading(false);
    }
  };

  return (
    <div className="p-4 w-full h-full bg-white rounded shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        {/* Organization Name */}
        <AppFormInput<IOrganizationCU>
          label="Organization Name"
          name="org_name"
          register={register}
          placeholder="Google"
          rules={{ required: "Organization Name is required" }}
          error={formState.errors.org_name}
          formState={formState}
        />

        {/* Location */}
        <AppFormInput<IOrganizationCU>
          label="Location"
          name="location"
          register={register}
          placeholder="New York, USA"
          rules={{ required: "Location is required" }}
          error={formState.errors.location}
          formState={formState}
        />

        {/* Industry */}
        <AppFormInput<IOrganizationCU>
          label="Industry"
          name="industry"
          register={register}
          placeholder="Software"
          rules={{ required: "Industry is required" }}
          error={formState.errors.industry}
          formState={formState}
        />

        {/* Domain URL */}
        <AppFormInput<IOrganizationCU>
          label="Domain URL"
          name="domain_url"
          type="url"
          register={register}
          rules={{ required: "Domain URL is required" }}
          placeholder="google.com"
          error={formState.errors.domain_url}
          formState={formState}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={cudLoading}
          className={`w-full py-2 px-4 rounded text-white ${
            cudLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {cudLoading
            ? isUpdate
              ? "Updating..."
              : "Creating..."
            : isUpdate
              ? "Update Organization"
              : "Create Organization"}
        </button>
      </form>
    </div>
  );
};

export default OrganizationCU;
