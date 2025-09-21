import { baseApi } from "@/redux/baseApi";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to get the signed URL from backend
    generateUploadUrl: builder.mutation({
      query: (fileInfo) => ({
        url: "api/files/upload", 
        method: "POST",
        data: fileInfo,
        //
      }),
    }),
  }),
});

export const { useGenerateUploadUrlMutation } = mediaApi;

