import ValidationError from "./ValidationError";
import TextareaAutosize from "react-textarea-autosize";
import InputControlBar from "./InputControlBar";
import { useRef } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  type?: "text" | "url" | "textarea";
  props?: Record<string, any>;
  className?: string;
  validationPath?: string;
  controls?: boolean;
}

export default function EditorInput({
  label,
  value,
  onChange,
  maxLength,
  type,
  props,
  className,
  validationPath,
  controls,
}: Props) {
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  return (
    <div className={className}>
      <div className="mb-1.5 flex justify-between items-end">
        <div className="flex">
          <div className="uppercase text-gray-300 text-sm font-medium">
            {label}
          </div>
          {maxLength && (
            <div className="text-sm italic font-light text-gray-400 ml-2">
              {value.length} / {maxLength}
            </div>
          )}
        </div>
        <div className="flex-none hidden md:block">
          {controls && (
            <InputControlBar
              value={value}
              onChange={onChange}
              inputRef={inputRef}
            />
          )}
        </div>
      </div>

      {type === "textarea" ? (
        <TextareaAutosize
          className="bg-dark-2 px-3 py-2 rounded w-full text-white ring-0 border-transparent focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          minRows={3}
          maxRows={15}
          ref={inputRef}
          {...props}
        />
      ) : (
        <input
          type={type || "text"}
          className="bg-dark-2 px-3 py-2 rounded w-full text-white ring-0 border-transparent focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          ref={inputRef}
          {...props}
        />
      )}
      {validationPath && <ValidationError path={validationPath} />}
    </div>
  );
}
