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
