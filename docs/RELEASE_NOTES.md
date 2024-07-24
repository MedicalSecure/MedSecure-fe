# MedSecure Release Notes

## MVP1 

### Introduction
MedSecure is an integrated system designed to secure the medication circuit in clinics. This system helps pharmacists, doctors, receptionists, nurses, nutritionists, and supervisors manage various aspects of patient care and hospital operations efficiently.

### Microservices Overview

- **sql-server-db**: Central database for storing application data.
- **message-broker**: Handles communication between services.
- **yarpapigateway**: Routes requests to the appropriate services.
- **diet.api**: Manages diet and nutrition for patients.
- **bacpatient.api**: Handle medication administration for hospitalized patients.
- **prescription.api**: Manages the creation and lifecycle of prescriptions.
- **medication.api**: Integrate with the pharmacy stock management system.
- **visit.api**: Manages patient visits and scheduling.
- **registration.api**: Handles patient registration and management.
- **unitcare.api**: Manages unit care services and hospital infrastructure.

### Features

#### Pharmacist
- **Manage Medication Stock**: Import new quantities through an Excel file and verify the import process, exporting invalid entries.
- **Validate Prescriptions**: Validate or reject prescriptions from doctors as a second verification step.

#### Receptionist
- **Patient Management**: Register new patients, activate archived patients, or archive patients who are leaving.

#### Doctor
- **Create Prescriptions**: Create and manage prescriptions for patients.
- **Patient Information**: View patient information and medical history.
- **Diagnosis Assistance**: Utilize a small AI model to help determine diagnoses based on input symptoms.
- **Hospitalization Decisions**: Decide whether to hospitalize patients.
- **Export Prescriptions**: Export prescriptions as PDF documents.
- **Schedule Visits**: Schedule upcoming patient visits using a calendar.

#### Nurse
- **Medication Administration**: Provide medications to patients on time according to the prescriptions.

#### Nutritionist
- **Diet Management**: Assign meals to patients based on their prescribed diet type.

#### Supervisor
- **Comprehensive Management**: Perform all tasks available to other roles.
- **Infrastructure Management**: Manage hospital infrastructure, including adding rooms, unit care facilities, and equipment.

### Workflow

1. **Patient Registration**
   - The receptionist registers a new patient or reactivates an archived patient using the `registration.api`.
  
2. **Doctor's Consultation**
   - The doctor reviews the patient's information through the `registration.api` and determines the diagnosis with the help of the AI model.
   - If necessary, the doctor creates a prescription using the `prescription.api`.

3. **Prescription Validation**
   - The prescription is sent to the pharmacist, who validates or rejects it using the `medication.api`.

4. **Medication Management**
   - The pharmacist manages the medication stock and verifies the import process through the `medication.api`.
   - Once the prescription is validated, the medication is prepared for the patient.

5. **Patient Care**
   - If the patient is hospitalized, the nurse administers the prescribed medications on time using the `bacpatient.api`.
   - The nutritionist assigns meals to the patient based on the diet prescribed using the `diet.api`.

6. **Ongoing Management**
   - The doctor can schedule follow-up visits using the `visit.api`.
   - The supervisor oversees the entire process, ensuring smooth operations and managing the hospital infrastructure through the `unitcare.api`.

### Conclusion
This initial release of MedSecure aims to streamline and secure the medication management process within clinics, ensuring efficient and accurate handling of patient care and hospital operations.
