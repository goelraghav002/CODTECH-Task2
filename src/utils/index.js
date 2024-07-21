export function formatDateTime(datetime) {
  if (typeof datetime !== "string") {
    console.error("Invalid input: Expected a string");
    return;
  }

  // Split the input string into date and time components
  const dateTimeParts = datetime.split(" ");
  if (dateTimeParts.length !== 2) {
    console.error('Invalid format: Expected "YYYY-MM-DD HH:MM"');
    return;
  }

  const [date, time] = dateTimeParts;

  // Split the date component into year, month, and day
  const dateParts = date.split("-");
  if (dateParts.length !== 3) {
    console.error('Invalid date format: Expected "YYYY-MM-DD"');
    return;
  }

  // eslint-disable-next-line no-unused-vars
  const [year, month, day] = dateParts;

  // Split the time component into hours and minutes
  const timeParts = time.split(":");
  if (timeParts.length !== 2) {
    console.error('Invalid time format: Expected "HH:MM"');
    return;
  }

  let [hours, minutes] = timeParts;

  // Convert the month from numeric to string representation
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[parseInt(month) - 1];

  // Convert the hours to a 12-hour format and determine AM/PM
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert '0' to '12' for midnight

  // Construct the formatted datetime string
  const formattedDateTime = `${day}, ${monthName} ⋮ ${hours}:${minutes} ${period}`;

  return formattedDateTime;
}


export function formatDate(datet) {
  if (typeof datet !== "string") {
    console.error("Invalid input: Expected a string");
    return;
  }
  
  // Split the date component into year, month, and day
  const dateParts = datet.split("-");
  if (dateParts.length !== 3) {
    console.error('Invalid date format: Expected "YYYY-MM-DD"');
    return;
  }

  // eslint-disable-next-line no-unused-vars
  const [year, month, day] = dateParts;

  // Convert the month from numeric to string representation
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[parseInt(month) - 1];


  // Construct the formatted datetime string
  const formattedDateTime = `${day}, ${monthName}`;

  return formattedDateTime;
}
