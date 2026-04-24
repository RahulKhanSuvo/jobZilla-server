import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PlanService } from "./Plan.service";

const createPlan = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await PlanService.createPlan(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Plan created successfully",
    data: result,
  });
});

const getAllPlans = catchAsync(async (req, res) => {
  const result = await PlanService.getAllPlans();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Plans fetched successfully",
    data: result,
  });
});

const getSinglePlan = catchAsync(async (req, res) => {
  const result = await PlanService.getSinglePlan(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Plan fetched successfully",
    data: result,
  });
});

const updatePlan = catchAsync(async (req, res) => {
  const result = await PlanService.updatePlan(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Plan updated successfully",
    data: result,
  });
});

const deletePlan = catchAsync(async (req, res) => {
  const result = await PlanService.deletePlan(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Plan deleted successfully",
    data: result,
  });
});

export const PlanController = {
  createPlan,
  getAllPlans,
  getSinglePlan,
  updatePlan,
  deletePlan,
};
