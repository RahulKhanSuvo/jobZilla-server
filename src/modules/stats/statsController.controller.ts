import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { statsService } from "./stats.service";

const getJobStats = catchAsync(async (req, res) => {
  const companyId = req.user?.id as string;
  const result = await statsService.getJobStats(companyId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job stats fetched successfully",
    data: result,
  });
});

export const statsController = {
  getJobStats,
};
