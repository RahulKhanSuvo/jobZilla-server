import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { resumeService } from "./resume.service";

const createResume = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error("Resume file is required");
  }
  const result = await resumeService.createResume(
    req.user?.id as string,
    req.file,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Resume created successfully",
    data: result,
  });
});

const getResumes = catchAsync(async (req, res) => {
  const result = await resumeService.getResumes(req.user?.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Resumes fetched successfully",
    data: result,
  });
});

const deleteResume = catchAsync(async (req, res) => {
  const result = await resumeService.deleteResume(
    req.user?.id as string,
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Resume deleted successfully",
    data: result,
  });
});

const setPrimaryResume = catchAsync(async (req, res) => {
  const result = await resumeService.setPrimaryResume(
    req.user?.id as string,
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Primary resume set successfully",
    data: result,
  });
});

export const resumeController = {
  createResume,
  getResumes,
  deleteResume,
  setPrimaryResume,
};
