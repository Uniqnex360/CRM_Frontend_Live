import { Search, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useState, useEffect } from "react";

import { IOrganization } from "../../interfaces/organization";
import { OrganizationService } from "../../services/organization";
import Loader from "../../components/common/Loader";
import Drawer from "../../components/common/Drawer";
import OrganizationRow from "./OrganizationRow";
import OrganizationCU from "./OrganizationCU";

const OrganizationPage = () => {
  const service = new OrganizationService();
  const [search, setSearch] = useState("");
  // list
  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState<IOrganization[]>([]);
  const [total, setTotal] = useState(0);
  //create
  const [createModal, setCreateModal] = useState(false);

  const fetchOrganization = async () => {
    try {
      setListLoading(true);
      const data = await service.getOrganization(search);
      console.log("data", data)
      setListData(data || []);
      setTotal(data.length || 0);
    } catch (error: any) {
      toast.error("API error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  return (
    <>
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <div className="p-4">
          <h2 className="text-2xl font-bold text-slate-900">Organizations</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage and organize your company accounts and teams efficiently.
          </p>
        </div>

        {/* Search */}
        <div className="relative p-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Organizations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <hr className="text-gray-200" />

        {/* Create buttons + total */}
        <div className="w-full h-12 p-2 flex items-center justify-between">
          <div className="text-gray-700">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{total}</span>{" "}
              results
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Organization
            </button>
          </div>
        </div>

        {/* List container */}
        <div className="flex-1 overflow-y-auto  p-2">
          {listLoading ? (
            <Loader />
          ) : listData.length > 0 ? (
            listData.map((org) => (
              <OrganizationRow
                key={org.id}
                org={{
                  ...org,
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-700 mt-4">
              No organizations found.
            </p>
          )}
        </div>
      </div>
      <Drawer
        isOpen={createModal}
        onClose={() => {
          setCreateModal(false);
        }}
        title="Create Organization"
      >
        <OrganizationCU fetchList={fetchOrganization} setCreateModal={setCreateModal}/>
      </Drawer>
    </>
  );
};

export default OrganizationPage;
