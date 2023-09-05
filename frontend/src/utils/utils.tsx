import axios from "axios";

const tags = ["spoiler", "*", "_", "~"];

const handleTag = (tag: string, content: string) => {
  const { element } = parseLine(content);
  switch (tag) {
    case "*":
      return <strong className="font-bold"> {element} </strong>;
    case "~":
      return <s> {element} </s>;
    default: // case "_":
      return <em> {element} </em>;
  }
};

const linkOrPlainText = (content: string): JSX.Element => {
  let parts = content.split(" ");
  let ret: JSX.Element[] = [];
  for (let part of parts) {
    if (part.startsWith("http://") || part.startsWith("https://")) {
      ret.push(
        <a
          className="hover:underline hover:text-lightAccent"
          href={part}
          target="_blank"
          rel="noreferrer"
        >
          {part}
        </a>
      );
    } else {
      ret.push(<>{part}</>);
    }
  }
  return (
    <>
      {ret.reduce((prev, curr) => (
        <>
          {prev} {curr}
        </>
      ))}
    </>
  );
};

const parseLine = (line: string, outerMost = false, yous?: string[]) => {
  const parts: JSX.Element[] = [];
  const tagged: string[] = [];
  let currentString = "";
  for (let i = 0; i < line.length; i++) {
    if (line[i] === ">" && line[i + 1] === ">" && outerMost) {
      let nextSpace = line.indexOf(" ", i);
      let nextBreak = line.indexOf("\n", i);
      let next =
        nextSpace === -1
          ? nextBreak
          : nextBreak === -1
          ? nextSpace
          : Math.min(nextSpace, nextBreak);
      next = next === -1 ? line.length : next;
      let id = line.slice(i + 2, next);
      if (!isNaN(parseInt(id)) && parseInt(id) > 0) {
        tagged.push(id);
        parts.push(<> {currentString} </>);
        parts.push(
          <a
            className="hover:underline hover:text-lightAccent"
            href={`/thread/${id}`}
          >
            {yous?.includes(id)
              ? `>>${id.padStart(8, "0")} (You)`
              : `>>${id.padStart(8, "0")}`}
          </a>
        );
        i = next;
        currentString = "";
        continue;
      }
    }

    if (tags.includes(line[i])) {
      if (currentString.trim().length > 0) {
        parts.push(linkOrPlainText(currentString));
        currentString = "";
      }
      let currentTag = line[i];
      let j = i + 1;
      let hasMatch = false;
      while (j < line.length) {
        if (line[j] === currentTag) {
          hasMatch = true;
          break;
        }
        j++;
      }
      if (!hasMatch) {
        break;
      } else {
        let content = line.slice(i + 1, j);
        parts.push(handleTag(currentTag, content));
        i = j;
      }
    } else {
      currentString += line[i];
    }
  }
  if (currentString.trim().length > 0) {
    parts.push(linkOrPlainText(currentString));
  }
  return {
    element: <> {parts.map((part) => part)} </>,
    tagged,
  };
};

export const parseContent = (content: string, yous?: string[]) => {
  const lines = content.split("\n");
  const result = [];
  const allTagged = [];
  for (let line of lines) {
    line = line.trim();
    if (line.length === 0) continue;
    if (line.startsWith(">") && line.length > 1 && line[1] !== ">") {
      const { element } = parseLine(line);
      result.push(<span className="text-greentext"> {element} </span>);
    } else {
      const { element, tagged } = parseLine(line, true, yous);
      allTagged.push(...tagged);
      result.push(element);
    }
  }

  return {
    element: (
      <div className="mx-4 my-4 break-words">
        {result.map((line) => (
          <>
            {line} <br />
          </>
        ))}
      </div>
    ),
    tagged: allTagged,
  };
};

export const getBlurDataUrl = (url: string) => {
  let lastDot = url.lastIndexOf(".");
  return url.slice(0, lastDot) + "-compressed.png";
};

export const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append("file", image);
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.imageId;
};
