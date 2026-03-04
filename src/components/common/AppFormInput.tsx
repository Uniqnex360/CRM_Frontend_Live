import {
  FieldValues,
  UseFormRegister,
  RegisterOptions,
  FieldError,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

interface AppFormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: FieldError;
  className?: string;
  formState?: UseFormStateReturn<T>; // pass formState from useForm
}

const AppFormInput = <T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  className = "",
  formState,
}: AppFormInputProps<T>) => {
  // Only show error after the form has been submitted
  const showError = !!error && formState?.isSubmitted;

  return (
    <div className={`mb-2 ${className} w-full`}>
      <label className="block mb-1 text-gray-700 font-medium">
        {label} {rules?.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...(register ? register(name, rules) : {})}
        placeholder={placeholder}
        className={`w-full border rounded p-2 focus:outline-none focus:ring-2
          ${showError ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}`}
      />
      {showError && (
        <p className="text-red-500 text-sm mt-1">{error?.message}</p>
      )}
    </div>
  );
};

export default AppFormInput;
