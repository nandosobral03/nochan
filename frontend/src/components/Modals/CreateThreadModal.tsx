import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef, useState } from "react";
import { CreateThreadRequestModel } from "@/model/thread.model";
import axios from "axios";
import { parseContent, uploadImage } from "@/utils/utils";
import { useLoadingStore, useModalStore } from "@/utils/store";
import { useRouter } from "next/router";
import { getCookie, setCookie } from "cookies-next";
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function CreateThreadModal() {
  const { clearModal } = useModalStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [captcha, setCaptcha] = useState("");
  const { setLoading } = useLoadingStore();
  const imageRef = useRef<HTMLInputElement>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    document.addEventListener("idClicked", (e) => {
      const { id } = (e as CustomEvent).detail;
      setContent((content) => content + `>>${id}\n`);
    });

    return () => {
      document.removeEventListener("idClicked", () => {});
    };
  }, []);

  const handleCreateThread = async () => {
    setLoading(true);
    let imageId;

    if (image) {
      imageId = await uploadImage(image);
    }
    let { tagged } = parseContent(content);
    const request: CreateThreadRequestModel = {
      title,
      author: authorName.trim().length > 0 ? authorName : undefined,
      content,
      taggedElementIds: tagged,
      imageId,
      captchaToken: captcha,
    };

    const userIdCookie = getCookie("user-id");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/threads`,
      request,
      { headers: { "user-id": userIdCookie } }
    );
    setLoading(false);
    const { userId, threadId } = res.data;
    if (res.status == 200) {
      router.push(`/thread/${threadId}`);
      setCookie("userId", userId);
      clearModal();
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full p-4">
        <input
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-100"
          type="text"
          placeholder="*Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-100"
          type="text"
          placeholder="Author"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        <textarea
          className="w-full px-4 py-2 mb-4 
        border border-gray-300 rounded 
        focus:outline-none focus:ring-2 focus:ring-gray-100
        resize-none"
          rows={10}
          placeholder="*Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => imageRef?.current?.click()}
            className="p-2 hoverable text-white rounded hoverable"
          >
            Select Image
          </button>
          <span className="text-gray-400 max-w-xs">
            {image
              ? `${image.name.slice(0, 10)}...${image.name.slice(
                  image.name.length - 8
                )}`
              : "*No image selected"}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center w-full py-4">
          <ReCAPTCHA
            sitekey="6LfxvfEnAAAAAHCPB2JO4JVleI9hSJEsasFBUUGC"
            onChange={(value) => setCaptcha(value || "")}
          />
        </div>
        <button
          className="w-full p-4 text-white font-bold rounded hoverable disabled:opacity-50"
          onClick={handleCreateThread}
          disabled={
            captcha.length == 0 ||
            title.length == 0 ||
            content.length == 0 ||
            !image
          }
        >
          Submit
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          handleImageChange(e);
        }}
        className="hidden"
        ref={imageRef}
      />
    </>
  );
}
