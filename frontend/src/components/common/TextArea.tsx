import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, rows = 4, maxLength, showCount = false, className = '', ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    React.useImperativeHandle(ref, () => {
      const textarea = document.createElement('textarea');
      Object.assign(textarea, { value: props.value || '' });
      return textarea as HTMLTextAreaElement;
    }, [props.value]);

    React.useEffect(() => {
      if (maxLength && props.value !== undefined) {
        setCharCount(String(props.value).length);
      }
    }, [props.value, maxLength]);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            rows={rows}
            className={`w-full rounded-lg border bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-600 hover:border-slate-500'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        {(helperText || (maxLength && showCount)) && (
          <div className="mt-1.5 flex justify-between text-sm">
            {helperText && !error && (
              <p className="text-slate-400">{helperText}</p>
            )}
            {maxLength && showCount && !error && (
              <p className="text-slate-400">
                {charCount} / {maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
export default TextArea;
