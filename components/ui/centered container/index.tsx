import React from "react";

// Define the prop types for the reusable component
interface CenteredContainerProps {
    children: React.ReactNode; // To accept any child elements or components
    maxWidth?: string; // Optional: Allows customization of max-width
    padding?: string;  // Optional: Allows customization of horizontal padding
}

// Reusable component to center content both vertically and horizontally
const CenteredContainer: React.FC<CenteredContainerProps> = ({
    children,
    maxWidth = "1280px", // Default max-width of 1280px
    padding = "16px",    // Default horizontal padding of 16px
}) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    maxWidth: maxWidth,
                    paddingLeft: padding,
                    paddingRight: padding,
                    width: "100%",
                    boxSizing: "border-box", // Ensures padding is included in width calculation
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default CenteredContainer;
