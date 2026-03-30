import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

import { useState, useEffect } from "react";

import { IUser } from "../../interfaces/user";
import { UserService } from "../../services/userService";
import Loader from "../../components/common/Loader";
import AppTable from "../../components/common/AppTable";

const UserPage = () => {
  const service = new UserService();
  const [search, setSearch] = useState("");
  // list
  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState<IUser[]>([]);
  const [total, setTotal] = useState(0);

  const fetchUnassignedUsers = async () => {
    try {
      setListLoading(true);
      const data = await service.getUnassingedUsers(search);
      setListData(data?.data || []);
      setTotal(data?.total || 0);
    } catch (error: any) {
      toast.error("API error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchUnassignedUsers();
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "actions",
      label: "Actions",
      width: "100px",
      sortable: false,
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2 cursor-pointer justify-center">
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
        <div className="p-4">
          <h2 className="text-2xl font-bold text-slate-900">Users</h2>
          <p className="text-sm text-slate-600 mt-1">
            List of unassinged Users.
          </p>
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
              <span className="font-semibold text-slate-900">{total}</span>{" "}
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
    </>
  );
};

export default UserPage;
