const returnYear = () =>{
    const date = new Date();
    return date.getFullYear();
}

const returnMonthName = (month) =>{
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
}

const returnShortMonthName = (month) => {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return monthNames[month];
}

const returnMonth = () => {
    const now = new Date();
    return now.getMonth();
}

const isToday = (today, day, month, year) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
}

const returnPrevMonth = (month, year) => {
    let newMonth = month;
    newMonth--;
    if (newMonth < 0) {
        newMonth = 11;
        year--;
    }
    return { month: newMonth, year };
}

const returnNextMonth = (month, year) => {
    let newMonth = month;
    newMonth++;
    if (newMonth > 11) {
        newMonth = 0;
        year++;
    }
    return { month: newMonth, year };
}

const returnDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
}

const returnDOTWName = (year,month,day) => {
    const date = new Date(year, month, day);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

const returnDOTW = (year,month,day) => {
    const date = new Date(year, month, day);
    return date.getDay();
}

const return42Days = (month, year) => {
    let offset = returnDOTW(year, month, 1);
    const startDate = new Date(year, month, 1 - offset);
    let days = [];
    for (let i = 0; i < 42; i++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        days.push({
            day: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
        });
    }
    return days;
}

const returnDate = (date) => {
    return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
    };
}

const isSelected = (selectedDate, day, month, year) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
}

const shortToLongDOTW = (short) => {
  if (!short) return null;
  return {
    Sun: "Sunday",
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
  }[short] || null;
};

export {returnYear, returnMonth, returnMonthName, returnShortMonthName, returnPrevMonth, returnNextMonth, returnDaysInMonth, returnDOTWName, returnDOTW, return42Days, isToday, returnDate, isSelected, shortToLongDOTW};