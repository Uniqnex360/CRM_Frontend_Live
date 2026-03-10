import { useState, useEffect } from "react";
import { Plus, Search, Users, Trash2, Edit, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import Loader from "./common/Loader";
import Drawer from "./common/Drawer";
import AppModal from "./common/AppModel";
import AppFormInput from "./common/AppFormInput";
import { ListResponse, ListService } from "../services/listService";

type ListCU = {
  id?: string;
  list_name: string;
  description: string;
  type: "companies" | "lead";
};

export default function ListsTab() {
  //data related state
  const [lists, setLists] = useState<ListResponse[]>([]);

  //ui related state
  const [loading, setLoading] = useState(false);
  const [cudLoading, setCUDLoading] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteid] = useState("");

  //filter related state
  const [searchQuery, setSearchQuery] = useState("");

  // service class
  const listService = new ListService();

  // Fetch Lists
  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await listService.getList();
      setLists(response.data);
    } catch (error) {
      toast.error(`Error fetching lists: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Search Filter // remove this after search itegration from backend
  const filteredLists = lists.filter(
    (list) =>
      list.list_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Create or update List
  const { register, handleSubmit, reset, formState } = useForm<ListCU>({
    mode: "onSubmit", // ensures validation runs only on submit
  });

  const clearForm = () => {
    reset({
      id: undefined,
      list_name: "",
      description: "",
      type: "companies",
    });
  };

  const onSubmit = async (data: ListCU) => {
    try {
      setCUDLoading(true);
      if (!isUpdate) {
        const response = await listService.createList(data);
        clearForm();
        setCreateModal(false);
        toast.success("List Created Successfully!!");
        fetchLists();
      } else {
        if (!data?.id) {
          throw new Error("ID is required");
        }
        const response = await listService.updateList(data?.id, data);
        clearForm();
        setCreateModal(false);
        setIsUpdate(false);
        toast.success("List Updated Successfully");
        fetchLists();
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setCUDLoading(false);
    }
  };

  // handle edit
  const handleEdit = (data: ListCU) => {
    setIsUpdate(true);
    reset(data);
    setCreateModal(true);
  };

  // Delete List
  const handleDeleteList = async () => {
    try {
      setCUDLoading(true)
      const response = await listService.deleteList(deleteId);
      toast.success("Delete Successfull");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteModal(false);
      setCUDLoading(false)
      fetchLists();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Saved Lists</h2>
            <p className="text-sm text-slate-600 mt-1">
              Organize and manage your contact lists
            </p>
          </div>

          <button
            onClick={() => {
              setCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create List
          </button>
        </div>

        {/* MAIN CONTAINER */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col h-[75vh]">
          {/* SEARCH */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SCROLLABLE LIST AREA */}
          <div className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredLists.map((list) => (
                  <div
                    key={list.id}
                    className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {list.list_name}
                          </h3>

                          <p className="text-xs text-slate-500">
                            {list.contactCount} contacts
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          className="p-2 hover:bg-slate-100 rounded-lg"
                          title="Edit list"
                          onClick={() => {
                            handleEdit({
                              id: list.id,
                              list_name: list.list_name,
                              description: list.description,
                              type: list.type || "companies",
                            });
                          }}
                        >
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteid(list.id);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg"
                          title="Delete list"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                      {list.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Updated {new Date(list.updated_at).toLocaleDateString()}
                      </span>

                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Export
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredLists.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No lists found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* CREATE LIST MODAL */}
      <Drawer
        title={isUpdate ? "Update List" : "Create List"}
        isOpen={createModal}
        onClose={() => {
          clearForm();
          setCreateModal(false);
          setIsUpdate(false);
        }}
      >
        <div className="p-4 w-full h-full bg-white rounded shadow-md">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Type */}
              <AppFormInput<ListCU>
                label="Type"
                name="type"
                type="select"
                register={register}
                rules={{ required: "Type is required" }}
                options={[
                  { id: "companies", value: "Company" },
                  { id: "people", value: "Lead" },
                ]}
                error={formState.errors.type}
                formState={formState}
              />
              {/* list name */}
              <AppFormInput<ListCU>
                label="Name"
                name="list_name"
                placeholder="List Name"
                register={register}
                rules={{ required: "List Name is required" }}
                error={formState.errors.list_name}
                formState={formState}
              />
              {/* description */}
              <AppFormInput<ListCU>
                label="Description"
                name="description"
                type="textarea"
                placeholder="Descriptoin"
                register={register}
                error={formState.errors.description}
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
                    ? "Update Lead"
                    : "Create Lead"}
              </button>
            </form>
          </div>
        </div>
      </Drawer>
      {/* Delete List MODAL */}
      <AppModal
        title="Delete List"
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
        }}
      >
        <div className="p-4 text-center">
          <p className="text-slate-900 text-lg">
            Are you sure you want to delete this list?
          </p>

          {/* <p className="text-xs text-slate-800 mt-1">
            This action cannot be undone.
          </p> */}

          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setDeleteModal(false)}
              className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteList}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              {cudLoading ? "Deleting" : "Delete"}
            </button>
          </div>
        </div>
      </AppModal>
    </>
  );
}
