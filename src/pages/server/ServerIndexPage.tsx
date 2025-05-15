import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
const ServerIndex: React.FC = () => {
  return (
    <div>
      <h1>Server Index Page</h1>
      <p>This is the server index page.</p>
      <Outlet />
    </div>
  );
}

export default ServerIndex;