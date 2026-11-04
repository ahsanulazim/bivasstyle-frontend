import { useRef } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import AddAttributeModalTwo from "./AddAttributeModalTwo";
import AttributeDeleteModal from "./AttributeDeleteModal";

const getVariationDisplay = (item) => {
  if (typeof item === "string") {
    return { name: item, value: item };
  }
  return {
    name: item?.name || item?.value || "",
    value: item?.value || item?.name || "",
  };
};

const AttributeCard = ({ attribute }) => {
  const attributeEditRef = useRef(null);
  const attributeDeleteRef = useRef(null);

  const variations = Array.isArray(attribute?.variations)
    ? attribute.variations
    : [];

  return (
    <div className="card bg-base-100 border border-base-200 shadow-xs">
      <AddAttributeModalTwo
        isEditing={true}
        ref={attributeEditRef}
        attribute={attribute}
      />
      <AttributeDeleteModal ref={attributeDeleteRef} id={attribute._id} />
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title text-base font-bold">{attribute.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="badge badge-primary badge-soft badge-xs font-mono">
                {attribute.slug}
              </span>
              {attribute.type && (
                <span className="badge badge-ghost badge-xs uppercase text-[9px] font-semibold">
                  {attribute.type}
                </span>
              )}
            </div>
          </div>
          <span className="badge badge-neutral badge-sm">
            {variations.length} values
          </span>
        </div>

        <div className="flex gap-1.5 flex-wrap my-3 min-h-[32px] items-center">
          {variations.slice(0, 6).map((item, index) => {
            const { name, value } = getVariationDisplay(item);
            const isColor =
              typeof value === "string" &&
              (value.startsWith("#") || value.startsWith("rgb"));

            return (
              <span
                key={index}
                className="badge badge-soft badge-sm flex items-center gap-1.5 py-2 px-2.5"
              >
                {isColor && (
                  <span
                    className="size-2.5 rounded-full border border-black/10 shadow-2xs inline-block"
                    style={{ backgroundColor: value }}
                  />
                )}
                <span>{name}</span>
              </span>
            );
          })}
          {variations.length > 6 && (
            <span className="badge badge-soft badge-sm opacity-60 text-[10px]">
              +{variations.length - 6} more
            </span>
          )}
        </div>

        <div className="card-actions justify-end mt-2 pt-2 border-t border-base-200">
          <button
            className="btn btn-ghost btn-xs text-info gap-1"
            onClick={() => attributeEditRef.current?.showModal()}
          >
            <LuSquarePen className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            className="btn btn-ghost btn-xs text-error gap-1"
            onClick={() => attributeDeleteRef.current?.showModal()}
          >
            <LuTrash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeCard;
