import { Gender, RegisterStatus } from "../enums/enum";
import { PatientDto, RegisterDto } from "../model/Registration";
import { RegisterForPrescription, RegisterWithPrescriptions } from "../types/prescriptionDTOs";
import { getRegistrationDate, getRegistrationStatus } from "./utilityFunctions";


//Register DTO EXTENSIONS
export function mapRegisterWithPrsToRegisterForPrs(registerWithPrescriptions: RegisterWithPrescriptions): RegisterForPrescription {

    const { id, patient, familyMedicalHistory, personalMedicalHistory, diseases, allergies, history, test, createdAt } = registerWithPrescriptions.register;

    const fullName = patient.firstName + (patient.lastName ? ` ${patient.lastName}` : '');
  
    return {
      id : id ?? "",
      mrn: id ?? "",
      currentStatus: getRegistrationStatus(history,id ?? ""), // You may need to determine the status or leave it undefined
      registeredAt: getRegistrationDate(history,createdAt ?? new Date(),id ?? ""), // You may need to set the registration date or leave it undefined
      patient_id: patient.id ?? "",
      patient_firstName: patient.firstName,
      patient_lastName: patient.lastName ?? null,
      patient_fullName: fullName,
      patient_dateOfBirth: patient.dateOfBirth ?? new Date(),
      patient_identity: patient.identity ,
      patient_cnam: patient.cnam ?? null,
      patient_assurance: patient.assurance ?? null,
      patient_gender: patient.gender ?? Gender.Other,
      patient_height: patient.height ?? null,
      patient_weight: patient.weight ?? null,
      patient_addressIsRegistrations: patient.addressIsRegistrations ?? null,
      patient_saveForNextTime: patient.saveForNextTime ?? null,
      patient_email: patient.email ?? null,
      patient_address1: patient.address1 ?? null,
      patient_address2: patient.address2 ?? null,
      patient_country: patient.country ?? null,
      patient_state: patient.state ?? null,
      patient_familyStatus: patient.familyStatus ?? null,
      patient_children: patient.children ?? null,
      familyMedicalHistory: familyMedicalHistory ?? [],
      personalMedicalHistory: personalMedicalHistory ?? [],
      diseases: diseases ?? [],
      allergies: allergies ?? [],
      history: history ?? [],
      test: test ?? [],
      prescriptions: registerWithPrescriptions.prescriptions ?? null,
      createdAt: createdAt ?? new Date(),
      modifiedAt:undefined,//modifiedAt,
      createdBy:"",//createdBy,
      modifiedBy:undefined,//modifiedBy
    };
  }


  export  function mapRegisterForPrsToRegisterWithPrs(registerForPrescription: RegisterForPrescription): RegisterWithPrescriptions {
    const {
      id,
      patient_id,
      patient_firstName,
      patient_lastName,
      patient_dateOfBirth,
      patient_identity,
      patient_cnam,
      patient_assurance,
      patient_gender,
      patient_height,
      patient_weight,
      patient_addressIsRegistrations,
      patient_saveForNextTime,
      patient_email,
      patient_address1,
      patient_address2,
      patient_country,
      patient_state,
      patient_familyStatus,
      patient_children,
      familyMedicalHistory,
      personalMedicalHistory,
      diseases,
      allergies,
      history,
      test,
      prescriptions,
      createdAt,
      modifiedAt,
      createdBy,
      modifiedBy,
      status
    } = registerForPrescription;
  
    const patient: PatientDto = {
      id: patient_id,
      firstName: patient_firstName,
      lastName: patient_lastName ?? "not-given",
      dateOfBirth: patient_dateOfBirth ?? new Date(),
      identity: patient_identity ?? "not-given",
      cnam: patient_cnam ?? null,
      assurance: patient_assurance ?? null,
      gender: patient_gender ?? null,
      height: patient_height ?? null,
      weight: patient_weight ?? null,
      addressIsRegistrations: patient_addressIsRegistrations ?? null,
      saveForNextTime: patient_saveForNextTime ?? null,
      email: patient_email ?? null,
      address1: patient_address1 ?? null,
      address2: patient_address2 ?? null,
      country: patient_country ?? null,
      state: patient_state ?? null,
      familyStatus: patient_familyStatus ?? null,
      children: patient_children ?? null
    };
  
    let reg:RegisterDto={
      id,
      patient,
      familyMedicalHistory: familyMedicalHistory ?? [],
      personalMedicalHistory: personalMedicalHistory ?? [],
      diseases: diseases ?? [],
      allergies: allergies ?? [],
      history: history ?? [],
      test: test ?? [],
      //prescriptions: prescriptions ?? null,
      status:status ?? RegisterStatus.Active,
      createdAt: createdAt ?? new Date()
    };
    return {
      register:reg,
      prescriptions:prescriptions ?? []
    }
  } 