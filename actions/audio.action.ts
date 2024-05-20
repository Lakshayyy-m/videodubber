"use server";
import { redirect } from "next/navigation";
import * as Bytescale from "@bytescale/sdk";
import nodeFetch from "node-fetch";

const fileApi = new Bytescale.FileApi({
  fetchApi: nodeFetch as any, // import nodeFetch from "node-fetch"; // Only required for Node.js. TypeScript: 'nodeFetch as any' may be necessary.
  apiKey: "public_12a1yxi7DjMArvJFKczDC2Yv3HTb", // This is your API key.
});

export const redirectToAudioUrl = (url: string) => {
  console.log(url);
  redirect(url);
};

export const downloadTrimmedFile = (path: string) => {
  fileApi
    .downloadFile({
      accountId: "12a1yxi", // This is your account ID.
      filePath: "/uploads/2022/12/25/hello_world.txt",
    })
    .then((response) => response.text()) // .text() | .json() | .blob() | .stream()
    .then(
      (fileContents) => console.log(fileContents),
      (error) => console.error(error)
    );
};
