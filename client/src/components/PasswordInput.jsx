import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // npm i react-icons

export default function PasswordInput({ label, value, onChange, ...rest }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder='••••••••'
        autoComplete='new-password'
        className="w-full rounded-lg border border-slate-300 bg-white/60 text-slate-900 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-9 text-slate-500 hover:text-slate-700"
        aria-label="toggle password visibility"
      >
        {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );
}