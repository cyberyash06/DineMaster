export default function Input({ label, type = 'text', ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {label}
            </label>
            <input
                type={type}
                autoComplete="Newtype"
                spellCheck="false"
                {...props}
                className="w-full rounded-lg border border-slate-300 bg-white/60 text-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
            />
        </div>
    );
}