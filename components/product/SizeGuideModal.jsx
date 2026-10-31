"use client";
import { useState } from "react";
import { LuRuler, LuX } from "react-icons/lu";

const SIZE_DATA_INCHES = [
  { size: "XS", chest: "34", waist: "30", hip: "36", shoulder: "13.5", length: "40" },
  { size: "S", chest: "36", waist: "32", hip: "38", shoulder: "14", length: "42" },
  { size: "M", chest: "38", waist: "34", hip: "40", shoulder: "14.5", length: "44" },
  { size: "L", chest: "40", waist: "36", hip: "42", shoulder: "15", length: "45" },
  { size: "XL", chest: "42", waist: "38", hip: "44", shoulder: "15.5", length: "46" },
  { size: "XXL", chest: "44", waist: "40", hip: "46", shoulder: "16", length: "46" },
];

const toCm = (val) => Math.round( parseFloat(val) * 2.54 );

const SizeGuideModal = ({ ref, category }) => {
  const [unit, setUnit] = useState("in");

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between border-b border-base-300 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <LuRuler className="text-main text-xl" />
            <h3 className="font-bold text-lg">Oiki Size & Measurement Guide</h3>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <LuX />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs opacity-70">
            Standard body measurements for Kurtis, Kameez, Dresses &amp; Tops.
          </p>
          <div className="join border border-base-300 rounded-box">
            <button
              type="button"
              onClick={() => setUnit("in")}
              className={`join-item btn btn-xs ${
                unit === "in" ? "btn-main" : "btn-ghost"
              }`}
            >
              Inches (in)
            </button>
            <button
              type="button"
              onClick={() => setUnit("cm")}
              className={`join-item btn btn-xs ${
                unit === "cm" ? "btn-main" : "btn-ghost"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table table-zebra text-center text-sm">
            <thead className="bg-base-200">
              <tr>
                <th>Size</th>
                <th>Chest / Bust ({unit})</th>
                <th>Waist ({unit})</th>
                <th>Hip ({unit})</th>
                <th>Shoulder ({unit})</th>
                <th>Length ({unit})</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_DATA_INCHES.map((row) => (
                <tr key={row.size}>
                  <td className="font-bold text-main">{row.size}</td>
                  <td>{unit === "in" ? row.chest : toCm(row.chest)}</td>
                  <td>{unit === "in" ? row.waist : toCm(row.waist)}</td>
                  <td>{unit === "in" ? row.hip : toCm(row.hip)}</td>
                  <td>{unit === "in" ? row.shoulder : toCm(row.shoulder)}</td>
                  <td>{unit === "in" ? row.length : toCm(row.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 bg-base-200/60 rounded-box p-4 text-xs space-y-2">
          <h4 className="font-bold text-sm">How to Measure Yourself:</h4>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>
              <strong>Chest / Bust:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.
            </li>
            <li>
              <strong>Waist:</strong> Measure around the narrowest part (natural waistline).
            </li>
            <li>
              <strong>Hip:</strong> Measure around the fullest part of your hips.
            </li>
            <li>
              <strong>Note for Sarees:</strong> All Oiki Sarees are standard Free Size (5.5 meters length with 0.8–1 meter unstitched blouse piece unless stated otherwise).
            </li>
          </ul>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default SizeGuideModal;

