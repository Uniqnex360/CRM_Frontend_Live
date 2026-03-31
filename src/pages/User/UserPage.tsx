import { Search } from "lucide-react";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

import { useState, useEffect } from "react";

import { IUser } from "../../interfaces/user";
import { UserService } from "../../services/userService";
import { OrganizationService } from "../../services/organization";
import Loader from "../../components/common/Loader";
import AppTable from "../../components/common/AppTable";
import AppModal from "../../components/common/AppModel";
import { AppSingleSelect } from "../../components/common/AppSingleSelect";

interface Option {
  id: string;
  value: string;
}

const UserPage = () => {
  const service = new UserService();
  const orgService = new OrganizationService();
  const [search, setSearch] = useState("");
  // list
  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState<IUser[]>([]);
  const [total, setTotal] = useState(0);
  //assing modal
  const [assignModal, setAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Option | null>(null);
  const [organizationList, setOrganizationList] = useState<Option[]>([]);

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

  const fetchOrganizationList = async () => {
    try {
      const data = await orgService.getOrganization("");
      console.log("organization data", data)
      const list = new Array()
      data?.map((item) => {
        list.push({id: item.id, value: item.org_name})
      })
      setOrganizationList(list)
    } catch (error: any) {
      setOrganizationList([]);
    }
  };
  useEffect(() => {
    fetchUnassignedUsers();
    fetchOrganizationList();
  }, []);

  const handleAssignSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setAssignLoading(true);
      const payload = {
        tenant_id: selectedOrg?.id,
      };
      const response = await service.assignUserOrganization(
        selectedUser?.id || "",
        payload,
      );
      toast.success(response?.message)
      fetchUnassignedUsers()
      setAssignModal(false)
    } catch (error: any) {
    } finally {
      setAssignLoading(false);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "actions",
      label: "Actions",
      width: "100px",
      sortable: false,
      render: (_: any, row: IUser) => (
        <div
          className="flex items-center gap-2 cursor-pointer justify-center"
          onClick={() => {
            setAssignModal(!assignModal);
            setSelectedUser(row);
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
      {/* assing Modal */}
      <AppModal
        title="Assing Organization"
        isOpen={assignModal}
        onClose={() => {
          setAssignModal(!assignModal);
          setSelectedUser(null);
          setSelectedOrg(null);
        }}
      >
        <div className="flex flex-col items-center justify-center h-[30vh]">
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Assingn Organization
            </label>

            {/* Organization Name */}
            <AppSingleSelect
              options={organizationList}
              value={selectedOrg}
              onChange={setSelectedOrg}
            ></AppSingleSelect>

            <button
              type="submit"
              className={`mt-38 px-4 py-2 rounded text-center text-white ${
                assignLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={assignLoading}
            >
              {assignLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </AppModal>
    </>
  );
};

export default UserPage;
