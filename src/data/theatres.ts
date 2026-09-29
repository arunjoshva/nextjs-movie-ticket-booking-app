export type Theatre = {
    id: string;
    name: string;
    location: string;
    city: string;
    address: string;
};

export const theatres: Theatre[] = [
    {
        id: "silver-screen-marina",
        name: "Silver Screen Marina",
        location: "Marina District",
        city: "Chennai",
        address: "Marina District, Chennai",
    },

    {
        id: "grand-cinema-tnagar",
        name: "Grand Cinema",
        location: "T. Nagar",
        city: "Chennai",
        address: "T. Nagar, Chennai",
    },

    {
        id: "royal-movie-house",
        name: "Royal Movie House",
        location: "Koyambedu",
        city: "Chennai",
        address: "Koyambedu, Chennai",
    },

    {
        id: "luminex-cinemas",
        name: "Luminex Cinemas",
        location: "Velachery",
        city: "Chennai",
        address: "Velachery, Chennai",
    },

    {
        id: "harbour-view-cinemas",
        name: "Harbour View Cinemas",
        location: "Polepettai",
        city: "Tuticorin",
        address: "Polepettai, Tuticorin",
    },
];