import React from 'react';

// This layout wraps the children for the /components route
const ComponentsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {/* You can add layout elements specific to the components section here */}
            {children} {/* Render the actual page content */}
        </div>
    );
}

export default ComponentsLayout;