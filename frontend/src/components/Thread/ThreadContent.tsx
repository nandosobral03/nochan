import { Thread } from "@/model/thread.model";
import { useCallback } from "react";

const tags = ["spoiler", "*", "_", "~"];

const handleTag = (tag: string, content: string) => {
  switch (tag) {
    case "*":
      return <strong className="font-bold"> {parseLine(content)} </strong>;
    case "~":
      return <s> {parseLine(content)} </s>;
    default: // case "_":
      return <em> {parseLine(content)} </em>;
  }
};

const parseLine = (line: string, outerMost = false) => {
  let parts: JSX.Element[] = [];
  let currentString = "";
  for (let i = 0; i < line.length; i++) {
    if (line[i] === ">" && line[i + 1] === ">" && outerMost) {
      console.log("Reference");
      let nextSpace = line.indexOf(" ", i);
      let nextBreak = line.indexOf("\n", i);
      let next =
        nextSpace === -1
          ? nextBreak
          : nextBreak === -1
          ? nextSpace
          : Math.min(nextSpace, nextBreak);
      next = next === -1 ? line.length : next;
      console.log("next", next);
      let id = line.slice(i + 2, next);
      console.log("id", id);
      // if is numeric
      if (!isNaN(parseInt(id)) && parseInt(id) > 0) {
        parts.push(<> {currentString} </>);
        parts.push(
          <a
            className="hover:underline hover:text-lightAccent"
            href={`/thread/${id}`}
          >
            {`>>${id.padStart(8, "0")}`}
          </a>
        );
        i = next;
        currentString = "";
        continue;
      }
    }

    if (tags.includes(line[i])) {
      if (currentString.trim().length > 0) {
        parts.push(<>{currentString}</>);
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
    parts.push(<>{currentString}</>);
  }
  return <> {parts.map((part) => part)} </>;
};

export default function ThreadContent({
  thread,
}: {
  thread: Thread;
}): JSX.Element {
  const parseContent = useCallback(
    (content: string) => {
      const lines = content.split("\n");
      const result = [];
      for (let line of lines) {
        line = line.trim();
        if (line.startsWith(">") && line.length > 1 && line[1] !== ">") {
          result.push(
            <span className="text-greentext"> {parseLine(line)} </span>
          );
        } else {
          result.push(parseLine(line, true));
          parseLine(line);
        }
      }
      return (
        <>
          {" "}
          {result.map((line) => (
            <>
              {" "}
              {line} <br />
            </>
          ))}{" "}
        </>
      );
    },
    [thread.content]
  );

  return (
    <blockquote className="p-10 text-left">
      {parseContent(thread.content)}
    </blockquote>
  );
}
