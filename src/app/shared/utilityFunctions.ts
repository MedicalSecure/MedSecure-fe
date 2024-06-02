import { PrescriptionStatus, HistoryStatus } from '../enums/enum';
import { HistoryDto } from '../model/Registration';

export function calculateAge(dateOfBirth: Date): number {
  const currentDate = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Check if the birthday hasn't occurred yet this year
  const currentMonth = currentDate.getMonth();
  const birthMonth = birthDate.getMonth();
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function getTimeString(dateToFormat: Date): string {
  //from date object => "11:45" for example
  return (
    ('0' + dateToFormat.getHours()).slice(-2) +
    ':' +
    ('0' + dateToFormat.getMinutes()).slice(-2)
  );
}

export function getDateString(
  dateToFormat: Date,
  dateFormat: string = 'dd-mm-yyyy - HH:MM'
): string {
  // try
  try {
    if (!dateToFormat) {
      return 'not-date';
    }
    if (typeof dateToFormat === 'string') {
      dateToFormat = new Date(dateToFormat);
    }
    if (typeof dateToFormat === 'object' && dateToFormat !== null) {
      dateToFormat = new Date(dateToFormat.toString());
    }
  } catch (error) {
    console.error('Error in getDateString:', error);
    return 'not-date';
  }

  // the real conversion
  const day = String(dateToFormat.getDate()).padStart(2, '0');
  const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
  const year = String(dateToFormat.getFullYear());

  const hour = ('0' + dateToFormat.getHours()).slice(-2);
  const minutes = ('0' + dateToFormat.getMinutes()).slice(-2);
  let formattedDate = dateFormat
    .replace('dd', day)
    .replace('mm', month)
    .replace('yyyy', year)
    .replace('HH', hour)
    .replace('MM', minutes);

  return formattedDate;
}

export function getRegistrationStatus(
  historyList: HistoryDto[] | null | undefined,
  registerId: string = 'not specified'
): HistoryStatus {
  if (!historyList) {
    console.error(
      `cant find register status : in getRegistrationStatus, registerId: ${registerId}, list of history: `,
      historyList
    );
    return HistoryStatus.Registered;
  }

  if (historyList.length === 0) {
    console.error(
      `cant find register status : in getRegistrationStatus, registerId: ${registerId}, list of history: `,
      historyList
    );
    return HistoryStatus.Registered;
  }

  // Sort the history list by date in descending order
  const sortedHistory = historyList.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Return the status of the first history object in the sorted list
  return sortedHistory[0].status;
}

//Get the last registration date from registrations history
export function getRegistrationDate(
  historyList: HistoryDto[] | null | undefined,
  backUpRegisterDate: string | Date = '1999/9/9',
  registerId: string = 'not specified'
): Date {
  if (!historyList) {
    console.error(
      `cant find register date : in getRegistrationStatus, registerId: ${registerId}, list of history: `,
      historyList
    );
    return new Date(backUpRegisterDate);
  }

  if (historyList.length === 0) {
    console.error(
      `cant find register status : in getRegistrationStatus, registerId: ${registerId}, list of history: `,
      historyList
    );
    return new Date(backUpRegisterDate);
  }

  // Sort the history list by date in descending order
  const sortedHistory = historyList.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Return the status of the first history object in the sorted list
  return sortedHistory[0].date;
}
