export default function Button({ children, ...props }) {
    return (
        <button
            {...props}
            className={`w-full bg-gradient-to-r mb-2 from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-60`}
        >
            {children}
        </button>
    );
}