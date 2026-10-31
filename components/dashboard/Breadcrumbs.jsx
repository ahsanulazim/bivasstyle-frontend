import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";

const Breadcrumbs = ({ title, subtitle }) => {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href="/dashboard">
            <LuLayoutDashboard className="h-4 w-4 stroke-current" />
          </Link>
        </li>
        {subtitle ? (
          <>
            <li>
              <Link href={`/dashboard/${title.toLowerCase()}`}>{title}</Link>
            </li>
            <li>{subtitle}</li>
          </>
        ) : (
          <li>{title}</li>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
