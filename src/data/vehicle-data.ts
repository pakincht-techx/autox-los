export type VehicleOption = {
    value: string;
    label: string;
};

export const CAR_BRANDS: VehicleOption[] = [
    { value: "toyota", label: "Toyota" },
    { value: "honda", label: "Honda" },
    { value: "isuzu", label: "Isuzu" },
    { value: "mitsubishi", label: "Mitsubishi" },
    { value: "nissan", label: "Nissan" },
    { value: "mazda", label: "Mazda" },
    { value: "ford", label: "Ford" },
    { value: "suzuki", label: "Suzuki" },
    { value: "mg", label: "MG" },
    { value: "byd", label: "BYD" },
    { value: "gwm", label: "GWM" },
    { value: "bmw", label: "BMW" },
    { value: "mercedes", label: "Mercedes-Benz" },
];

export const MOTO_BRANDS: VehicleOption[] = [
    { value: "honda", label: "Honda" },
    { value: "yamaha", label: "Yamaha" },
    { value: "suzuki", label: "Suzuki" },
    { value: "kawasaki", label: "Kawasaki" },
    { value: "vespa", label: "Vespa" },
    { value: "gp_x", label: "GPX" },
    { value: "ryuka", label: "Ryuka" },
];

export const TRUCK_BRANDS: VehicleOption[] = [
    { value: "isuzu", label: "Isuzu" },
    { value: "hino", label: "Hino" },
    { value: "fuso", label: "Mitsubishi Fuso" },
    { value: "ud", label: "UD Trucks" },
    { value: "scania", label: "Scania" },
    { value: "volvo", label: "Volvo" },
];

export const AGRI_BRANDS: VehicleOption[] = [
    { value: "kubota", label: "Kubota" },
    { value: "yanmar", label: "Yanmar" },
    { value: "johndeere", label: "John Deere" },
    { value: "newholland", label: "New Holland" },
    { value: "iseki", label: "Iseki" },
    { value: "ford", label: "Ford" },
];

export const MODELS_BY_BRAND: Record<string, VehicleOption[]> = {
    // Cars
    "Toyota": [
        { value: "yaris", label: "Yaris" },
        { value: "yaris_ativ", label: "Yaris Ativ" },
        { value: "vios", label: "Vios" },
        { value: "altis", label: "Corolla Altis" },
        { value: "camry", label: "Camry" },
        { value: "hilux_revo", label: "Hilux Revo" },
        { value: "hilux_vigo", label: "Hilux Vigo" },
        { value: "fortuner", label: "Fortuner" },
        { value: "commuter", label: "Commuter" },
        { value: "majesty", label: "Majesty" },
        { value: "alphard", label: "Alphard" },
        { value: "vellfire", label: "Vellfire" },
        { value: "chr", label: "C-HR" },
        { value: "corolla_cross", label: "Corolla Cross" },
    ],
    "Honda": [
        { value: "city", label: "City" },
        { value: "jazz", label: "Jazz" },
        { value: "civic", label: "Civic" },
        { value: "accord", label: "Accord" },
        { value: "hrv", label: "HR-V" },
        { value: "crv", label: "CR-V" },
        { value: "brv", label: "BR-V" },
        { value: "mobilio", label: "Mobilio" },
    ],
    "Isuzu": [
        { value: "dmax", label: "D-Max" },
        { value: "mux", label: "MU-X" },
        { value: "elf", label: "Elf (Truck)" },
        { value: "frr", label: "FRR (Truck)" },
    ],
    "Mitsubishi": [
        { value: "mirage", label: "Mirage" },
        { value: "attrage", label: "Attrage" },
        { value: "xpander", label: "Xpander" },
        { value: "pajero_sport", label: "Pajero Sport" },
        { value: "triton", label: "Triton" },
    ],
    "Nissan": [
        { value: "almera", label: "Almera" },
        { value: "navara", label: "Navara" },
        { value: "terra", label: "Terra" },
        { value: "kicks", label: "Kicks" },
    ],
    "Mazda": [
        { value: "mazda2", label: "Mazda 2" },
        { value: "mazda3", label: "Mazda 3" },
        { value: "cx3", label: "CX-3" },
        { value: "cx30", label: "CX-30" },
        { value: "cx5", label: "CX-5" },
        { value: "cx8", label: "CX-8" },
        { value: "bt50", label: "BT-50" },
    ],
    "Ford": [
        { value: "ranger", label: "Ranger" },
        { value: "everest", label: "Everest" },
        { value: "mustang", label: "Mustang" },
    ],
    "Suzuki": [
        { value: "swift", label: "Swift" },
        { value: "ciaz", label: "Ciaz" },
        { value: "celebra", label: "Celerio" },
        { value: "ertiga", label: "Ertiga" },
        { value: "carry", label: "Carry" },
    ],
    "MG": [
        { value: "mg3", label: "MG 3" },
        { value: "mg5", label: "MG 5" },
        { value: "zs", label: "ZS" },
        { value: "hs", label: "HS" },
        { value: "extender", label: "Extender" },
    ],

    // Motos
    "Yamaha": [
        { value: "fino", label: "Fino" },
        { value: "grand_filano", label: "Grand Filano" },
        { value: "nmax", label: "NMAX" },
        { value: "xmax", label: "XMAX" },
        { value: "aerox", label: "Aerox" },
        { value: "qbix", label: "QBIX" },
        { value: "gt125", label: "GT125" },
    ],
    "Kawasaki": [
        { value: "ninja", label: "Ninja" },
        { value: "z", label: "Z Series" },
        { value: "klx", label: "KLX" },
        { value: "versys", label: "Versys" },
    ],

    // Agri
    "Kubota": [
        { value: "l3218", label: "L3218" },
        { value: "l4018", label: "L4018" },
        { value: "l5018", label: "L5018" },
        { value: "m6040", label: "M6040" },
        { value: "m7040", label: "M7040" },
        { value: "m9540", label: "M9540" },
        { value: "mu5702", label: "MU5702" },
    ],
    "Yanmar": [
        { value: "ef352t", label: "EF352T" },
        { value: "ef393t", label: "EF393T" },
        { value: "ef494t", label: "EF494T" },
        { value: "ef514t", label: "EF514T" },
        { value: "ym357a", label: "YM357A" },
    ],
    "John Deere": [
        { value: "5040d", label: "5040D" },
        { value: "5045d", label: "5045D" },
        { value: "5050d", label: "5050D" },
        { value: "6100b", label: "6100B" },
    ],
};

export const YEARS = Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
});
