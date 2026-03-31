import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import { IAdminUserCU } from "../../interfaces/user";
import AppFormInput from "../../components/common/AppFormInput";
import { UserService } from "../../services/userService";

interface AdminUserCUProps {
  isUpdate?: boolean;
  setCreateModal: (val: boolean) => void;
  fetchUser: () => void;
  AdminUserData?: IAdminUserCU;
}
const AdminUserCU = ({
  isUpdate = false,
  setCreateModal,
  fetchUser,
  AdminUserData,
}: AdminUserCUProps) => {
  const service = new UserService();

  //loading state
  const [cudLoading, setCUDLoading] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<IAdminUserCU>({
    mode: "onSubmit",
    defaultValues: AdminUserData || {},
  });

  const clearForm = () => {
    reset();
  };

  //api calls
  const onSubmit = async (data: IAdminUserCU) => {
    try {
      setCUDLoading(true);
      if (!isUpdate) {
        await service.createUser(data);
        toast.success("User Created Successfully");
      } else {
        console.log(data);
        toast.success("User Updated Successfully");
      }
      clearForm();
      setCreateModal(false);
      fetchUser();
    } catch (error: any) {
      console.log("Api error", error);

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
    <>
      <div className="p-4 w-full h-full bg-white rounded shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          {/*Name */}
          <AppFormInput<IAdminUserCU>
            label="Name"
            name="name"
            register={register}
            placeholder="John Doe"
            rules={{ required: "Name is required" }}
            error={formState.errors.name}
            formState={formState}
          />

          {/* Email */}
          <AppFormInput<IAdminUserCU>
            label="Email"
            name="email"
            register={register}
            placeholder="johndoe@gmail.com"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            }}
            error={formState.errors.email}
            formState={formState}
          />

          {/* Password */}
          <AppFormInput<IAdminUserCU>
            label="Password"
            name="password"
            type="password"
            register={register}
            rules={{ required: "Password is required" }}
            error={formState.errors.password}
            formState={formState}
          />

          {/* Role */}
          <AppFormInput<IAdminUserCU>
            label="Role"
            name="role"
            type="select"
            options={[
              { id: "user", value: "User" },
              { id: "admin", value: "Admin" },
            ]}
            register={register}
            rules={{ required: "Role is required" }}
            error={formState.errors.role}
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
                ? "Update User"
                : "Create User"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminUserCU;
