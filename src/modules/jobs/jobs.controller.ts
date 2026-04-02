import { catchAsync } from "../../shared/catchAsync";
import { jobsService } from "./jobs.service";
import { sendResponse } from "../../shared/sendResponse";

const createJob = catchAsync(async (req, res) => {
  const result = await jobsService.createJob(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

export const jobsController = {
  createJob,
};
