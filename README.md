

# SaveIt

SaveIt is a web application built with Next.js and TypeScript, designed to help users manage and save their important files and data.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Features

- **Authentication:** User authentication is implemented using the `Authform` component, likely supporting signup, sign-in, and potentially OTP verification via `otpModal`.
- **File Uploading:** Utilizes `react-dropzone` via the `FileUploader` component for drag-and-drop file uploads.
- **Data Visualization:** Includes a `Chart` component, suggesting the app provides some form of data visualization.
- **UI Components:** Leverages Radix UI components (dialog, dropdown menu, label, select, separator, slot, toast) for a consistent and accessible user interface.
- **Responsive Design:** Includes a `MobileNavigation` component, indicating a focus on mobile responsiveness.
- **Search and Sorting:** Implements `Search` and `Sort` components for easy data filtering and organization.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Gautam97s/SaveIt.git
    cd SaveIt
    ```

2.  **Install dependencies:**

    ```bash
    npm install # or yarn install, pnpm install, bun install
    ```

3.  **Environment Variables:**

    Create a `.env.local` file in the root directory and add your environment variables.  You'll need to configure these based on the services you're using (e.g., Appwrite, database credentials, etc.).  Example:

    ```
    NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
    NEXT_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
    ```

4.  **Run the development server:**

    ```bash
    npm run dev # or yarn dev, pnpm dev, bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1.  **Sign up or log in:** Use the authentication form (`Authform`) to create a new account or log in to an existing one.
2.  **Upload files:** Drag and drop files into the designated area using the `FileUploader` component.
3.  **View and manage data:**  Utilize the search and sort functionalities to organize and find your saved data.
4.  **Interact with visualizations:**  If applicable, review the data presented in the `Chart` component.

## Dependencies

This project uses the following main dependencies:

| Package                                  | Version | Description                                                                                                |
| ---------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `@hookform/resolvers`                   | ^5.1.1 |  For integrating form validation with React Hook Form.                                                                                               |
| `@radix-ui/react-alert-dialog`          | ^1.1.14 |  For creating accessible alert dialogs.                                                                                               |
| `@radix-ui/react-dialog`                | ^1.1.14 |  For creating accessible dialogs.                                                                                               |
| `@radix-ui/react-dropdown-menu`         | ^2.1.15 |  For creating accessible dropdown menus.                                                                                               |
| `@radix-ui/react-label`                 | ^2.1.7  |  For creating accessible labels.                                                                                               |
| `@radix-ui/react-select`                | ^2.2.5  |  For creating accessible select components.                                                                                               |
| `@radix-ui/react-separator`             | ^1.1.7  |  For creating visual separators.                                                                                               |
| `@radix-ui/react-slot`                  | ^1.2.3  |  For creating flexible component APIs.                                                                                               |
| `@radix-ui/react-toast`                 | ^1.2.14 |  For displaying toast notifications.                                                                                               |
| `@tabler/icons-react`                   | ^2.34.0 |  A collection of high-quality icons.                                                                                               |
| `class-variance-authority`             | ^0.7.1  |  For managing class name variations in components.                                                                                               |
| `clsx`                                   | ^2.1.1  |  A utility for constructing `className` strings conditionally.                                                                                               |
| `eslint-config-standard`               | ^17.1.0 |  Standard ESLint configuration.                                                                                               |
| `input-otp`
