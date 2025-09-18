import { baseApi } from "@/redux/baseApi";

// Define the expected response shape when requesting a signed URL
interface IUploadUrlResponse {
  uploadUrl: string;
  viewUrl: string; // URL to view the file after upload
}

// Define the arguments needed to request the signed URL
interface IGenerateUploadUrlArgs {
  fileName: string;
}

interface IResponse<T> {
    url: string,
    method: string,
    data: T
}

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to get the signed URL from your backend
    generateUploadUrl: builder.mutation({
      query: (fileInfo) => ({
        url: "api/files/upload", // Your backend endpoint for this
        method: "POST",
        data: fileInfo,
        //
      }),
    }),
  }),
});

export const { useGenerateUploadUrlMutation } = mediaApi;

