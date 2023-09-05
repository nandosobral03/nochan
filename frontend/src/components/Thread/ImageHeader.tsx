import { ImageModel } from "@/model/thread.model";

export default function ImageHeader({ image }: { image: ImageModel }) {
  const getSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }
  };

  return (
    <span className="flex gap-2">
      <a href={image.url} target="_blank">
        {image.url.split("/").pop()!.substring(0, 4) +
          "..." +
          image.url
            .split("/")
            .pop()
            ?.substring(image.url.split("/").pop()!.length - 8)}
      </a>
      <span className="hidden md:inline">
        ({getSize(image.size)}, {image.dimensions})
      </span>
      <span className="inline md:hidden">({getSize(image.size)})</span>

      {/* Reverse image searches */}
      <span className="gap-2 hidden md:flex">
        <a
          className="hover:underline hover:text-lightAccent"
          target="_blank"
          href={`https://www.google.com/searchbyimage?sbisrc=nochan&image_url=${image.url}&safe=off`}
        >
          google
        </a>
        <a
          className="hover:underline hover:text-lightAccent"
          target="_blank"
          href={`https://yandex.com/images/search?source=collections&url=${image.url}&rpt=imageview`}
        >
          yandex
        </a>
        <a
          className="hover:underline hover:text-lightAccent"
          target="_blank"
          href={`https://iqdb.org/?url=${image.url}`}
        >
          iqdb
        </a>
        <a
          className="hover:underline hover:text-lightAccent"
          target="_blank"
          href={`https://trace.moe/?auto&url=${image.url}`}
        >
          wait
        </a>
      </span>
    </span>
  );
}
