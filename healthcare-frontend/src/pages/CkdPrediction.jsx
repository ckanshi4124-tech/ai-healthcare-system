import React, { useState } from "react";
import API from "../services/api";

export default function CkdPrediction() {
  const initial = {
    age: "", bp: "", sg: "", al: "", su: "",
    rbc: "1", pc: "1", pcc: "0", ba: "0",
    bgr: "", bu: "", sc: "", sod: "", pot: "",
    hemo: "", pcv: "", wbcc: "", rbcc: "",
    htn: "0", dm: "0", cad: "0", appet: "1", pe: "0", ane: "0"
  };

  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handlePredict = async () => {
    setResult(null);
    setLoading(true);
    try {
      // convert all values to numbers before sending
      const cleaned = {};
      Object.keys(form).forEach((k) => {
        // allow empty -> NaN will cause backend to error with friendly message
        cleaned[k] = form[k] === "" ? "" : Number(form[k]);
      });

      const res = await API.post("/predict-ckd", cleaned);

      if (res.data?.error) {
        alert("Server error: " + res.data.error);
      } else if (res.data?.prediction) {
        setResult(res.data.prediction);
      } else {
        alert("Unexpected response from server. Check backend logs.");
      }
    } catch (err) {
      console.error(err);
      alert("Prediction failed. Check backend (see terminal logs).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CKD Prediction</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["age","Age"],
          ["bp","BP (mm Hg)"],
          ["sg","Specific Gravity"],
          ["al","Albumin"],
          ["su","Sugar"],
          ["bgr","Blood Glucose Random"],
          ["bu","Blood Urea"],
          ["sc","Serum Creatinine"],
          ["sod","Sodium"],
          ["pot","Potassium"],
          ["hemo","Hemoglobin"],
          ["pcv","PCV"],
          ["wbcc","WBCC"],
          ["rbcc","RBCC"]
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block text-sm text-gray-700 mb-1">{label}</label>
            <input
              type="number"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        {/* Dropdowns */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">RBC</label>
          <select name="rbc" value={form.rbc} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="1">Normal</option>
            <option value="0">Abnormal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">PC (Pus Cell)</label>
          <select name="pc" value={form.pc} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="1">Normal</option>
            <option value="0">Abnormal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">PCC (Pus Cell Clumps)</label>
          <select name="pcc" value={form.pcc} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="0">None</option>
            <option value="1">Present</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">BA (Bacteria)</label>
          <select name="ba" value={form.ba} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="0">None</option>
            <option value="1">Present</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Hypertension</label>
          <select name="htn" value={form.htn} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Diabetes</label>
          <select name="dm" value={form.dm} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">CAD</label>
          <select name="cad" value={form.cad} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Appetite</label>
          <select name="appet" value={form.appet} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="1">Good</option>
            <option value="0">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Pedal Edema</label>
          <select name="pe" value={form.pe} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Anemia</label>
          <select name="ane" value={form.ane} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handlePredict}
          disabled={loading}
          className="bg-indigo-700 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-xl font-semibold">
          Result: {String(result).toUpperCase()}
        </div>
      )}
    </div>
  );
}
