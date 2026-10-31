import { useRef } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import AddAttributeModalTwo from "./AddAttributeModalTwo";
import AttributeDeleteModal from "./AttributeDeleteModal";

const AttributeCard = ({ attribute }) => {
  const attributeEditRef = useRef(null);
  const attributeDeleteRef = useRef(null);

  return (
    <div className="card bg-base-100">
      <AddAttributeModalTwo
        isEditing={true}
        ref={attributeEditRef}
        attribute={attribute}
      />
      <AttributeDeleteModal ref={attributeDeleteRef} id={attribute._id} />
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">{attribute.name}</h2>
          <span className="badge badge-primary badge-soft badge-sm">
            {attribute.slug}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {attribute.variations.length > 5
            ? attribute.variations.slice(0, 5).map((value, index) => (
                <span key={index} className="badge badge-soft">
                  {value}
                </span>
              ))
            : attribute.variations.map((value, index) => (
                <span key={index} className="badge badge-soft">
                  {value}
                </span>
              ))}
          {attribute.variations.length > 5 && (
            <span className="badge badge-soft">
              +{attribute.variations.length - 5} more
            </span>
          )}
        </div>
        <div className="card-actions justify-end mt-3">
          <button
            className="btn btn-info btn-sm"
            onClick={() => attributeEditRef.current.showModal()}
          >
            <LuSquarePen /> Edit
          </button>
          <button
            className="btn btn-error btn-sm"
            onClick={() => attributeDeleteRef.current.showModal()}
          >
            <LuTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeCard;
