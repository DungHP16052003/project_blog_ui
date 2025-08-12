import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Input.module.scss";

const Input = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    disabled = false,
    required = false,
    fullWidth = false,
    size = "md",
    className,
    id,
    name,
    multiline = false,
    rows = 4,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputClasses = clsx(
        styles.input,
        styles[size],
        {
            [styles.error]: error,
            [styles.disabled]: disabled,
            [styles.fullWidth]: fullWidth,
            [styles.multiline]: multiline,
        },
        className
    );

    // Loại bỏ các props không hợp lệ cho HTML elements
    const {
        multiline: _multiline,
        rows: _rows,
        ...restProps
    } = props;

    const commonProps = {
        id: inputId,
        name,
        className: inputClasses,
        placeholder,
        value,
        onChange,
        onBlur,
        disabled,
        required,
        "aria-invalid": error ? "true" : "false",
        "aria-describedby": error
            ? `${inputId}-error`
            : helperText
            ? `${inputId}-helper`
            : undefined,
        ...restProps
    };

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.inputWrapper}>
                {multiline ? (
                    <textarea
                        {...commonProps}
                        rows={rows}
                    />
                ) : (
                    <input
                        {...commonProps}
                        type={type}
                    />
                )}
            </div>

            {error && (
                <div id={`${inputId}-error`} className={styles.errorText}>
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div id={`${inputId}-helper`} className={styles.helperText}>
                    {helperText}
                </div>
            )}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    fullWidth: PropTypes.bool,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
};

export default Input;