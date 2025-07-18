import React from "react";
import { getAllBoards } from "src/actions/board-action";
import DashboardBoards from "src/components/layout/dashboard-boards";

const DashboardPage = async () => {
  const { data: boards, error } = await getAllBoards(true);

  return <DashboardBoards initialBoards={boards || []} error={error} />;
};

export default DashboardPage;
