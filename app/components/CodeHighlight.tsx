import Highlight, { defaultProps, Language, PrismTheme } from "prism-react-renderer";
import { ReactNode } from "react";

type StyleObj = {
  [key: string]: string | number | null;
};

export function CodeHighlighter({ children, language, theme, showLineNumber }: { children: string; language: Language; theme?: PrismTheme; showLineNumber: boolean }) {
  const BaseComponent = (
    <Highlight {...defaultProps} theme={theme} code={children} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );

  const Pre = ({ children, className, style }: { children: ReactNode; className: string; style: StyleObj }) => (
    <pre className={`text-left my-12 p-2 overflow-x-scroll ${className}`} style={style}>
      {children}
    </pre>
  );
  const Line = ({ children }: { children: ReactNode }) => <div className="table-row">{children}</div>;
  const LineNo = ({ children }: { children: ReactNode }) => <span className="table-cell text-right pr-2 select-none opacity-50">{children}</span>;
  const LineContent = ({ children }: { children: ReactNode }) => <span className="table-cell">{children}</span>;

  const WithLineNumber = (
    <Highlight {...defaultProps} theme={theme} code={children} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              <LineContent>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
        </Pre>
      )}
    </Highlight>
  );

  return showLineNumber ? WithLineNumber : BaseComponent;
}
