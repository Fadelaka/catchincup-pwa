# CatchinCup ☕

A modern, responsive coffee ordering web application built with React and TailwindCSS.

## Features

- **Coffee Menu**: Browse through a variety of coffee drinks including classic, specialty, and cold beverages
- **Shopping Cart**: Add items to cart, adjust quantities, and remove items
- **Category Filtering**: Filter coffee by category (All, Classic, Specialty, Cold Drinks)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful coffee-themed design with custom color palette
- **Real-time Updates**: Cart updates instantly with item count and total price

## Technologies Used

- **React 18**: Modern React with hooks for state management
- **TailwindCSS**: Utility-first CSS framework with custom coffee theme
- **Lucide React**: Beautiful icons for the interface
- **Create React App**: Bootstrapped with Create React App

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd catchincup
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your default browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
catchincup/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js             # Main application component
│   ├── index.css          # Global styles and Tailwind imports
│   └── index.js           # React DOM entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
└── README.md             # Project documentation
```

## Features Breakdown

### Coffee Menu
- 8 different coffee options
- Each item includes name, description, price, and rating
- Visual coffee emoji indicators
- Category-based organization

### Shopping Cart
- Slide-out cart interface
- Quantity adjustment controls
- Remove individual items
- Real-time price calculation
- Item count badge on cart button

### Design System
- Custom coffee color palette
- Responsive grid layout
- Smooth transitions and hover effects
- Modern card-based design

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
