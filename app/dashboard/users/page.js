import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import UsersData from "@/components/dashboard/users/UsersData";

const page = () => {
  return (
    <>
      <Breadcrumbs title="Users" />
      <section className="mb-5">
        <h2 className="font-bold text-2xl">Users</h2>
        <p className="text-sm opacity-50">All registered users of Oiki</p>
      </section>
      <section>
        <UsersData />
      </section>
    </>
  );
};

export default page;
