import AudioTrimmer from "@/components/AudioTrimmer";
import UploadFile from "@/components/UploadFile";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadFile/>
    </main>
  );
}
