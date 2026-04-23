import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PlanService } from "./Plan.service";

const createPlan = catchAsync(async (req, res) => {
  const result = await PlanService.createPlan(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Plan created successfully",
    data: result,
  });
});

export const PlanController = {
  createPlan,
};
