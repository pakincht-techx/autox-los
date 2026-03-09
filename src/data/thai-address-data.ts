export interface Subdistrict {
    name: string;
    zipCode: string;
}

export interface District {
    name: string;
    subdistricts: Subdistrict[];
}

export interface Province {
    name: string;
    districts: District[];
}

export const THAI_ADDRESS_DATA: Province[] = [
    {
        name: "กรุงเทพมหานคร",
        districts: [
            {
                name: "ลาดพร้าว",
                subdistricts: [
                    { name: "ลาดพร้าว", zipCode: "10230" },
                    { name: "จรเข้บัว", zipCode: "10230" }
                ]
            },
            {
                name: "บางรัก",
                subdistricts: [
                    { name: "บางรัก", zipCode: "10500" },
                    { name: "สีลม", zipCode: "10500" },
                    { name: "สุริยวงศ์", zipCode: "10500" }
                ]
            },
            {
                name: "ปทุมวัน",
                subdistricts: [
                    { name: "ปทุมวัน", zipCode: "10330" },
                    { name: "รองเมือง", zipCode: "10330" },
                    { name: "ลุมพินี", zipCode: "10330" }
                ]
            }
        ]
    },
    {
        name: "นนทบุรี",
        districts: [
            {
                name: "เมืองนนทบุรี",
                subdistricts: [
                    { name: "สวนใหญ่", zipCode: "11000" },
                    { name: "ตลาดขวัญ", zipCode: "11000" },
                    { name: "บางเขน", zipCode: "11000" }
                ]
            },
            {
                name: "ปากเกร็ด",
                subdistricts: [
                    { name: "ปากเกร็ด", zipCode: "11120" },
                    { name: "บางพูด", zipCode: "11120" },
                    { name: "บ้านใหม่", zipCode: "11120" }
                ]
            }
        ]
    },
    {
        name: "ปทุมธานี",
        districts: [
            {
                name: "เมืองปทุมธานี",
                subdistricts: [
                    { name: "บางปรอก", zipCode: "12000" },
                    { name: "บ้านใหม่", zipCode: "12000" }
                ]
            },
            {
                name: "ธัญบุรี",
                subdistricts: [
                    { name: "ประชาธิปัตย์", zipCode: "12130" },
                    { name: "บึงยี่โถ", zipCode: "12130" }
                ]
            }
        ]
    },
    {
        name: "สมุทรปราการ",
        districts: [
            {
                name: "เมืองสมุทรปราการ",
                subdistricts: [
                    { name: "ปากน้ำ", zipCode: "10270" },
                    { name: "บางเมือง", zipCode: "10270" }
                ]
            },
            {
                name: "บางพลี",
                subdistricts: [
                    { name: "บางพลีใหญ่", zipCode: "10540" },
                    { name: "บางแก้ว", zipCode: "10540" }
                ]
            }
        ]
    }
];
