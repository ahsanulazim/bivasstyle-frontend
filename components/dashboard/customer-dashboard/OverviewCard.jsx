import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const OverviewCard = ({ overview }) => {
  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-sm">{overview.title}</h2>
        <h1 className="text-3xl font-bold">{overview.count}</h1>
        <Link
          href="#"
          className="link link-hover link-info flex items-center gap-2"
        >
          View All <LuChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default OverviewCard;
