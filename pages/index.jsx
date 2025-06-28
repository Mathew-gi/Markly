import { Download } from "../images/download";
import { Chat } from "../images/chat";
import { renderMarkdown } from "../fonts/renderMarkdown.js";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import "../fonts/montserrat.js";
import "../fonts/montserrat-bold.js";
import jsPDF from "jspdf";

export default function HomePage() {
  const [isWelcomeRead, setIsWelcomeRead] = useState(false);
  const [isVerticalSeparation, setIsVerticalSeparation] = useState(true);
  const [visualLineHeights, setVisualLineHeights] = useState([]);
  const [activeLine, setActiveLine] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const [lineHeight, setLineHeight] = useState(0);
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const markdownRef = useRef(null);
  const gutterRef = useRef(null);

  const handleCaret = () => {
    const el = textareaRef.current;
    const pos = el.selectionStart;
    const textUptoPos = el.value.slice(0, pos);
    const lineNumber = textUptoPos.split("\n").length - 1;
    setActiveLine(lineNumber);
  };

  const getVisualLineHeights = () => {
    const textarea = textareaRef.current;
    const style = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(style.lineHeight);
    const width = textarea.clientWidth;

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.width = `${width}px`;
    div.style.font = style.font;
    div.style.fontSize = style.fontSize;
    div.style.fontFamily = style.fontFamily;
    div.style.lineHeight = style.lineHeight;
    div.style.padding = style.padding;
    div.style.border = style.border;
    document.body.appendChild(div);

    const lines = textarea.value.split("\n");
    const result = lines.map((line) => {
      div.innerText = line === "" ? " " : line;
      const height = div.scrollHeight;
      const visualLines = Math.round(height / lineHeight);
      return visualLines;
    });

    document.body.removeChild(div);
    return result;
  };

  const updateLineCount = () => {
    const el = textareaRef.current;
    const lines = el.value.split("\n").length;
    setLineCount(lines);
    setVisualLineHeights(getVisualLineHeights());
  };

  const handleDownload = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      hotfixes: ["px_scaling"],
    });

    doc.setFont("Montserrat-VariableFont_wght", "normal");
    doc.setFontSize(12);
    renderMarkdown(doc, text);

    doc.save(
      `${textareaRef.current.value
        .split("/n")[0]
        .replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, "")}.pdf`
    );
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, []);

  useEffect(() => {
    const lh = parseFloat(
      window.getComputedStyle(textareaRef.current).lineHeight
    );
    setLineHeight(lh);
    updateLineCount();
    setIsVerticalSeparation(window.innerWidth >= 768);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div
        className={clsx(
          isWelcomeRead
            ? "top-0 -translate-y-[150%] -translate-x-1/2"
            : "top-1/2 -translate-1/2",
          "absolute left-1/2 flex justify-center items-center gap-[5%] w-[30%] aspect-[5/1] text-gray-500 font-medium transition-all duration-500"
        )}
      >
        <div
          onClick={() => {
            setIsWelcomeRead(true);
          }}
          className="flex justify-center items-center h-full aspect-square rounded-full shadow-[0_0_10px_#6A7282] animated-shape transform cursor-pointer"
        >
          <Chat className="h-3/5" fill="#6A7282"></Chat>
        </div>
        <div>
          Интуитивный и лёгкий <b>markdown-редактор</b>, который помогает
          сосредоточиться на тексте и сразу видеть результат.
        </div>
      </div>
      <div
        className={clsx(
          isWelcomeRead
            ? isVerticalSeparation
              ? "top-1/2 -translate-y-1/2"
              : "top-0"
            : "top-0 -translate-y-[150%]",
          isVerticalSeparation ? "w-1/2 h-full" : "w-full h-1/2",
          "absolute left-0 flex justify-center bg-gray-50 transition-all duration-700 pt-[2%] overflow-y-scroll"
        )}
      >
        <div className="relative flex justify-center w-9/10 min-h-2/5 text-[80%]">
          <div
            ref={gutterRef}
            className="absolute -left-[3%] w-[3%] text-[#6A7282] text-right px-2 z-2"
          >
            {visualLineHeights.map((visLines, i) => (
              <div
                key={i}
                className={clsx(i === activeLine && "text-black font-semibold")}
                style={{
                  height: `${visLines * lineHeight}px`,
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            className="w-[94%] min-h-full px-[1%] resize-none focus:outline-none z-2 overflow-hidden"
            onKeyUp={() => {
              handleCaret();
              updateLineCount();
            }}
            onClick={handleCaret}
            onScroll={(e) => {
              const scrollTop = e.target.scrollTop;
              textareaRef.current.scrollTop = scrollTop;
              gutterRef.current.scrollTop = scrollTop;
            }}
            onChange={(e) => {
              setText(e.target.value);
              updateLineCount();
              autoResize();
            }}
            value={text}
            onInput={updateLineCount}
            ref={textareaRef}
            spellCheck={false}
          ></textarea>

          {visualLineHeights.length > 0 && (
            <div
              style={{
                top: `${
                  visualLineHeights
                    .slice(0, activeLine)
                    .reduce((acc, h) => acc + h, 0) * lineHeight
                }px`,
                height: `${visualLineHeights[activeLine] * lineHeight}px`,
              }}
              className="absolute w-10/9 bg-white z-1 transition-all duration-150"
            ></div>
          )}
        </div>
      </div>

      <div
        className={clsx(
          isWelcomeRead
            ? isVerticalSeparation
              ? "top-0"
              : "top-1/2"
            : "top-0 -translate-y-[150%]",
          isVerticalSeparation ? "w-1/2 h-full" : "w-full h-1/2",
          "absolute right-0 p-[2%] pl-[6%] text-[80%] transition-all duration-700 whitespace-pre-line overflow-y-scroll markdown"
        )}
        ref={markdownRef}
      >
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold mb-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h1 className="text-xl font-bold mb-2" {...props} />
            ),
            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
            // и так далее
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
      <div
        onClick={() => {
          handleDownload();
        }}
        className="flex justify-center items-center absolute bottom-5 right-5 w-[3%] aspect-square bg-white shadow-[0_0_5px_#6A7282] rounded-full hover:-translate-y-1/5 transition-transform duration-300 cursor-pointer"
      >
        <Download fill="#6A7282" className="h-3/5"></Download>
      </div>
    </div>
  );
}
