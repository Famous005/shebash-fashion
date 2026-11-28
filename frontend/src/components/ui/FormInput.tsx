interface FormInputProps {
  label:        string;
  id:           string;
  type?:        string;
  value:        string;
  onChange:     (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?:       string;
  placeholder?: string;
  required?:    boolean;
  autoComplete?: string;
}

export default function FormInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  autoComplete,
}: FormInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      "0.78rem",
          color:         "rgba(255,255,255,0.6)",
          letterSpacing: "0.04em",
        }}
      >
        {label}{required && <span style={{ color: "#C9A84C", marginLeft: "2px" }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        style={{
          backgroundColor: "#0A0A0A",
          border:          `1px solid ${error ? "#7B1C2E" : "rgba(201,168,76,0.2)"}`,
          color:           "#FFFFFF",
          fontFamily:      "var(--font-sans)",
          fontSize:        "0.9rem",
          padding:         "0.7rem 0.9rem",
          outline:         "none",
          width:           "100%",
          transition:      "border-color 0.2s ease",
        }}
        onFocus={e => {
          (e.target as HTMLInputElement).style.borderColor = "#C9A84C";
        }}
        onBlur={e => {
          (e.target as HTMLInputElement).style.borderColor =
            error ? "#7B1C2E" : "rgba(201,168,76,0.2)";
        }}
      />
      {error && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize:   "0.72rem",
            color:      "#E8A0A0",
            marginTop:  "0.1rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}