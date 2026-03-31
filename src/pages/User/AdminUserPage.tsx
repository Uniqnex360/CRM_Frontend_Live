import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { UserPlus, Plus } from "lucide-react";

import { useState, useEffect } from "react";

import { IUser } from "../../interfaces/user";
import { UserService } from "../../services/userService";
import Loader from "../../components/common/Loader";
import Drawer from "../../components/common/Drawer";
import AppTable from "../../components/common/AppTable";

import AdminUserCU from "./AdminUserCU";

const AdminUserPage = () => {
  const service = new UserService();
  const [search, setSearch] = useState("");
  //create
  const [createModal, setCreateModal] = useState(false);
  // list
  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState<IUser[]>([]);

  //assing modal
  const [assignModal, setAssignModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setListLoading(true);
      const data = await service.getUsersForAdmin();
      setListData(data);
      console.log("response", data);
    } catch (error: any) {
      toast.error("API error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "actions",
      label: "Actions",
      width: "100px",
      sortable: false,
      render: (_: any, row: any) => (
        <div
          className="flex items-center gap-2 cursor-pointer justify-center"
          onClick={() => {
            setAssignModal(!assignModal);
          }}
        >
          <button
            className="p-1 hover:bg-gray-100 text-gray-600 rounded transition-colors cursor-pointer"
            title="Assing Organization"
          >
            <UserPlus size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Users</h2>
            <p className="text-sm text-slate-600 mt-1">List of Users.</p>
          </div>
          <div>
            <button
              onClick={() => {
                setCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>
        {/* Search */}
        <div className="relative p-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <hr className="text-gray-200" />

        <div className="w-full h-12 p-2 flex items-center justify-between">
          <div className="text-gray-700">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {listData?.length || 0}
              </span>{" "}
              results
            </p>
          </div>
        </div>

        <div>
          {listLoading ? (
            <>
              <Loader />
            </>
          ) : (
            <>
              <AppTable columns={columns} data={listData}></AppTable>
            </>
          )}
        </div>
      </div>
      <Drawer
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
        }}
        title="Create User"
      >
        <AdminUserCU fetchUser={fetchUsers} setCreateModal={setCreateModal} />
      </Drawer>
    </>
  );
};

export default AdminUserPage;
