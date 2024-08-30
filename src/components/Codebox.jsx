import React, { useState } from "react";

const CodeBox = ({code, setCode}) => {
  // Generate line numbers based on the code
  const lineNumbers = code
    .split("\n")
    .map((_, i) => i + 1)
    .join("\n");

  return (
    <div className="h-full grow p-4 bg-gray-800 rounded-lg">
      <div className="flex bg-gray-900 rounded-lg">
        <div className="py-2 pl-2 pr-4 text-sm text-gray-400 bg-gray-800 border-r border-gray-700">
          <pre className="h-full leading-6">{lineNumbers}</pre>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono w-full p-2 text-sm text-white bg-gray-900 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
};

export default CodeBox;
