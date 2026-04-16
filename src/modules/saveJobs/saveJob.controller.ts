import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { saveJobService } from "./saveJob.service";

const saveAJob = catchAsync(async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user?.id;
  const result = await saveJobService.saveJob(
    userId as string,
    jobId as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job saved successfully",
    data: result,
  });
});
const getSavedJobs = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await saveJobService.getSavedJobs(userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Saved jobs fetched successfully",
    data: result,
  });
});
export const saveJobController = {
  saveAJob,
  getSavedJobs,
};
