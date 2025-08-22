// components/Dashboard/ErrorBoundary.jsx
import React from 'react';

const ErrorFallback = ({ error, resetError }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Something went wrong
      </h2>
      <p className="text-slate-600 mb-6">
        We encountered an error while loading the dashboard. Please try refreshing the page.
      </p>
      <button
        onClick={resetError}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-slate-500">
            Error Details
          </summary>
          <pre className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
);

export default ErrorFallback;
