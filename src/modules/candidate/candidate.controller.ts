import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { candidateService } from "./candidate.service";
import { uploadToImgBB } from "../../utils/imgbb";

const getCandidate = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("candidate controller", id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate fetched successfully",
    data: id,
  });
});

const updateCandidate = catchAsync(async (req, res) => {
  const { id: userId } = req.user!;
  const body = req.body;
  console.log("body", body);
  if (req.file) {
    const imageUrl = await uploadToImgBB(req.file.buffer);
    body.avatar = imageUrl.url;
  }

  const result = await candidateService.updateCandidate(userId, body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate updated successfully",
    data: result,
  });
});

export const candidateController = {
  getCandidate,
  updateCandidate,
};
