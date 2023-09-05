import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useRef, useState } from "react";
import { CreateReplyRequestModel } from "@/model/reply.model";
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

export default function CreateReplyModal({
  threadId,
  id,
}: {
  threadId: string;
  id?: string;
}) {
  const { clearModal } = useModalStore();
  const router = useRouter();
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
    if (id) setContent((content) => content + `>>${id}\n`);

    document.addEventListener("idClicked", (e) => {
      const { threadId, id } = (e as CustomEvent).detail;
      setContent((content) => content + `>>${id}\n`);
    });

    return () => {
      document.removeEventListener("idClicked", () => {});
    };
  }, []);

  const handleCreateReply = async () => {
    setLoading(true);
    let imageId;

    if (image) {
      imageId = await uploadImage(image);
    }
    let { tagged } = parseContent(content);
    const request: CreateReplyRequestModel = {
      author: authorName.trim().length > 0 ? authorName : undefined,
      content,
      taggedElementIds: tagged,
      imageId,
      captchaToken: captcha,
    };

    const userIdCookie = getCookie("userId");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/threads/${threadId}/`,
      request,
      { headers: { "user-id": userIdCookie } }
    );
    const { replyId, userId } = res.data;
    setLoading(false);
    if (res.status == 200) {
      setCookie("userId", userId);
      clearModal();
      router.push(`/thread/${threadId}`);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full p-4">
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
          placeholder="Content"
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
              : "No image selected"}
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
          onClick={handleCreateReply}
          disabled={captcha.length == 0 || content.length == 0}
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
