const patients = [
    { id: 1, firstName: "Ali", lastName: "Mammadov", phone: "123-456-7890" },
    { id: 2, firstName: "Aysel", lastName: "Huseynova", phone: "987-654-3210" },
    { id: 3, firstName: "Elvin", lastName: "Aliyev", phone: "555-555-5555" },
    { id: 4, firstName: "Leyla", lastName: "Ismayilova", phone: "111-222-3333" },
    { id: 5, firstName: "Rashad", lastName: "Mammadli", phone: "444-555-6666" },
    { id: 6, firstName: "Nigar", lastName: "Huseynova", phone: "777-888-9999" }
];

export const getAllPatients = () => {
    return patients;
};

export const createPatient = (patient: { firstName: string; lastName: string; phone: string }) => {
    const newPatient = {
        id: patients.length + 1,
        firstName: patient.firstName,
        lastName: patient.lastName,
        phone: patient.phone
    };
    patients.push(newPatient);
    return newPatient;
}


export const getPatientById = (id: number) => {
    return patients.find(patient => patient.id === id);
};

export const updatePatient = (
    id: number,
    updatedPatient: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }
) => {
    const patient = patients.find(p => p.id === id);

    if (!patient) return null;

    if (updatedPatient.firstName !== undefined) {
        patient.firstName = updatedPatient.firstName;
    }

    if (updatedPatient.lastName !== undefined) {
        patient.lastName = updatedPatient.lastName;
    }

    if (updatedPatient.phone !== undefined) {
        patient.phone = updatedPatient.phone;
    }

    return patient;
};

export const deletePatient = (id: number) => {
    const index = patients.findIndex(patient => patient.id === id);
    if (index !== -1) {
        patients.splice(index, 1);
        return true;
    }   
    return false;
};