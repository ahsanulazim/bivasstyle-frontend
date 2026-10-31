import Action from "@/components/dashboard/attribute/type/Action";
import TypesTable from "@/components/dashboard/attribute/type/TypesTable";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";

const page = async ({ params }) => {
  const { type } = await params;

  return (
    <>
      <Breadcrumbs
        title="Attributes"
        subtitle={type.slice(0, 1).toUpperCase() + type.slice(1, type.length)}
      />
      <Action type={type} />
      <section>
        <TypesTable type={type} />
      </section>
    </>
  );
};

export default page;
