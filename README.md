# Vehicle Location Seeder

This project is a React application that periodically seeds vehicle location data to a Supabase database.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm or pnpm or yarn

### Installing

1. Clone the repository:

    ```bash
    git clone https://github.com/madushas/vehicle-tracking.git
    ```

2. Install the dependencies:

    ```bash
    cd vehicle-tracker
    npm install
    ```

3. Create a `.env` file in the root directory and add your Geocode API key:

    ```txt
    REACT_APP_GEOCODE_API_KEY=your_api_key_here
    ```

4. Start the development server:

    ```bash
    npm start
    ```

    ```bash
    pnpm run dev
    ```

    ```bash
    yarn start
    ```

## Built With

- [React](https://reactjs.org/) - The JavaScript framework used
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework used
- [Supabase](https://supabase.io/) - The database used
- [openmaptiles](https://openmaptiles.org/) - The map tiles used

## Usage

Navigate to the `LocationSeederPage` in your browser to start seeding vehicle location data to your database.

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
