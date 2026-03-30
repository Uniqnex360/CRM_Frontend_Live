import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChildDetail {
  key: string;
  value: string | number;
}

interface OrgProps {
  org: {
    org_name: string;
    industry: string;
    location: string;
    children?: ChildDetail[]; // dynamic list of objects
  };
}

const OrganizationRow = ({ org }: OrgProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 mb-3 bg-white rounded-lg shadow-md">
      {/* Main row */}
      <div
        className="w-full flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex gap-8">
          <div className="font-semibold text-gray-900">{org.org_name}</div>
          <div className="text-gray-600">{org.industry}</div>
          <div className="text-gray-600">{org.location}</div>
        </div>
        <div className="text-gray-500">
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Dropdown content */}
      {open && org.children && org.children.length > 0 && (
        <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {org.children.map((child, index) => (
            <div
              key={index}
              className="flex justify-between p-2 mb-2 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700 font-medium">{child.key}</span>
              <span className="text-gray-600">{child.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationRow;
