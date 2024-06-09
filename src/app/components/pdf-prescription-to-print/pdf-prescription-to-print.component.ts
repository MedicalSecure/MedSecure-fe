import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  PrescriptionDto,
  RegisterForPrescription,
} from '../../model/Prescription';
import { RegisterDto } from '../../model/Registration';
import { calculateAge, getDateString } from '../../shared/utilityFunctions';
import { CommonModule } from '@angular/common';
//@ts-ignore
import html2pdf from 'html2pdf.js';
import { RegistrationService } from '../../services/registration/registration.service';
import { PrescriptionApiService } from '../../services/prescription/prescription-api.service';
import { SnackBarMessagesService } from '../../services/util/snack-bar-messages.service';
import {
  SnackBarMessageProps,
  snackbarMessageType,
} from '../snack-bar-messages/snack-bar-messages.component';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-pdf-prescription-to-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-prescription-to-print.component.html',
  styleUrl: './pdf-prescription-to-print.component.css',
})
export class PdfPrescriptionToPrintComponent {
  @ViewChild('contentToPrint', { static: true }) content!: ElementRef;

  @Input() printData:
    | { prescriptionId: string; registerId: string }
    | undefined;

  prescription: PrescriptionDto | undefined;
  register: RegisterDto | undefined;

  get prescriptionMapped():PrescriptionDto | undefined {
    //this function is used to sort the dispenses from 00 ==> to 23
    if (!this.prescription) return undefined;

    // Helper function to parse Hour to a number
    const parseHour = (hour: string | number): number => {
      if (typeof hour === 'number') return hour;
      const parsed = parseInt(hour, 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    return {
      ...this.prescription,
      posologies: this.prescription.posologies.map(posology => ({
        ...posology,
        dispenses: posology.dispenses.sort((a, b) => {
          const hourA = parseHour(a.hour);
          const hourB = parseHour(b.hour);
          return hourA - hourB;
        })
      }))
    };
  }

  isPrescriptionLoading = false;
  isRegisterLoading = false;

  constructor(
    private registerService: RegistrationService,
    private prescriptionService: PrescriptionApiService,
    private snackBarMessagesService: SnackBarMessagesService
  ) {}

  // Overload 1: Using IDs
  public async downloadPrescriptionPDF(
    prescriptionId?: string,
    registerId?: string
  ): Promise<void>;
  // Overload 2: Using DTOs directly
  public async downloadPrescriptionPDF(
    prescription: PrescriptionDto,
    register?: RegisterDto
  ): Promise<void>;

  public async downloadPrescriptionPDF(
    prescriptionIdOrDto: string | PrescriptionDto | undefined = undefined,
    registerIdOrDto: string | RegisterDto | undefined = undefined
  ): Promise<void> {
    const props: SnackBarMessageProps = {
      messageContent: 'Preparing your prescription for export',
      messageType: snackbarMessageType.Info,
      durationInSeconds:2,
    };
    this.snackBarMessagesService.displaySnackBarMessage(props);
    
    if (typeof prescriptionIdOrDto === 'string') {
      //update the @Input ids if given in the function
      this.printData
        ? (this.printData.prescriptionId = prescriptionIdOrDto)
        : (this.printData = {
            prescriptionId: prescriptionIdOrDto,
            registerId: '',
          });
    } else if (isPrescriptionDto(prescriptionIdOrDto)) {
      this.prescription = prescriptionIdOrDto;
      //update the id
      this.printData
        ? (this.printData.prescriptionId = prescriptionIdOrDto.id)
        : (this.printData = {
            prescriptionId: prescriptionIdOrDto.id,
            registerId: '',
          });
    }

    if (typeof registerIdOrDto === 'string') {
      //update the @Input ids if given in the function
      this.printData
        ? (this.printData.registerId = registerIdOrDto)
        : (this.printData = {
            registerId: registerIdOrDto,
            prescriptionId: '',
          });
    } else if (isRegisterDto(registerIdOrDto)) {
      this.register = registerIdOrDto;
      //update the id
      if (registerIdOrDto.id)
        this.printData
          ? (this.printData.registerId = registerIdOrDto.id)
          : (this.printData = {
              registerId: registerIdOrDto.id,
              prescriptionId: '',
            });
    } else if (isPrescriptionDto(prescriptionIdOrDto)) {
      this.printData
        ? (this.printData.registerId = prescriptionIdOrDto.registerId)
        : (this.printData = {
            registerId: prescriptionIdOrDto.registerId,
            prescriptionId: '',
          });
    }
    
    if (
      typeof prescriptionIdOrDto === 'string' ||
      typeof registerIdOrDto === 'string' ||
      //in case of prescription dto provided but no register dto => the register id is filled from the prescription.registerId
      (isPrescriptionDto(prescriptionIdOrDto) && registerIdOrDto == undefined && this.printData?.registerId)
    ) {
      await this.fetchDataIfChanged();
    }
    
    if (!this.register && !this.prescription) {
      const props: SnackBarMessageProps = {
        messageContent: 'Export Pdf: Prescription data is missing',
        messageType: snackbarMessageType.Error,
      };
      this.snackBarMessagesService.displaySnackBarMessage(props);
      console.error('Prescription or patient data is missing');
      return;
    }
    //perform download
    this.performDownload();
  }

  private performDownload() {
    
    let firstName = this.register?.patient.firstName;
    let lastName = this.register?.patient.lastName;
    let name = firstName
      ? `${firstName}_${lastName}`
      : this.prescription?.id.slice(0, 14);

    let date = this.prescription?.createdAt ? getDateString(this.prescription?.createdAt, 'ddmmyyyy_HHMM') : getDateString(new Date(),'ddmmyyyy_HHMM');
    const options: html2pdf.CreateOptions = {
      margin: 0,
      filename: `prescription_${name}_${date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: [200, 500]
        , orientation: 'portrait' },
    };

    html2pdf().from(this.content.nativeElement).set(options).save();
    const props: SnackBarMessageProps = {
      messageContent: 'Prescription exported !',
      messageType: snackbarMessageType.Success,
      durationInSeconds:2,
    };
    this.snackBarMessagesService.displaySnackBarMessage(props);
  }

  GetAge(date: Date | undefined) {
    if (!date) return 'Error';
    return calculateAge(date);
  }
  GetDate(date: Date | undefined) {
    if (!date) return 'Error';
    return getDateString(date, 'dd/mm/yyyy');
  }
  GetDateNow() {
    return getDateString(new Date(), 'dd/mm/yyyy');
  }

  getFullName(){
    if(this.register?.patient)
     return this.register.patient.firstName + " " + this.register.patient.lastName
    return "Error"
  }

  async fetchDataIfChanged() {
    //start them in parallel
    const promises: Promise<void>[] = [];

    if (this.printData?.prescriptionId !== this.prescription?.id) {
      promises.push(this.fetchPrescriptionById());
    }

    if (this.printData?.registerId !== this.register?.id) {
      promises.push(this.fetchRegisterById());
    }
    //wait for them both
    await Promise.all(promises);
  }

  async fetchPrescriptionById(
    prescriptionId: string | null | undefined = this.printData?.prescriptionId
  ) {
    if (!prescriptionId) return;
    this.isPrescriptionLoading = true;
    try {
      const response = await firstValueFrom(
        this.prescriptionService.getPrescriptionById(prescriptionId)
      );
      if (!response || response.prescriptions.data.length === 0) return;
      this.prescription = response.prescriptions.data[0];
    } catch (error) {
      console.error(error);
    } finally {
      this.isPrescriptionLoading = false;
    }
  }

  async fetchRegisterById(
    registerId: string | null | undefined = this.printData?.registerId
  ) {
    
    if (!registerId) return;
    this.isRegisterLoading = true;
    try {
      const response = await firstValueFrom(
        this.registerService.getRegisterById(registerId)
      );
      if (!response || !response.register) return;
      this.register = response.register;
    } catch (error) {
      console.error(error);
    } finally {
      this.isRegisterLoading = false;
    }
  }

  doctor = {
    name: 'Hammadi Dr',
    email: 'Hammadi@gmail.com',
    address: 'rue med ali el hammi',
    phone: '+216 93111251',
  };
}

function isPrescriptionDto(obj: any): obj is PrescriptionDto {
  return obj && typeof obj === 'object' && 'posologies' in obj;
}

function isRegisterDto(obj: any): obj is RegisterDto {
  return obj && typeof obj === 'object' && 'patient' in obj;
}
