
// Types
type CalendarGeneralStyleCells = {
  border: string,
  borderRadius: number,
  bg: string,
  color: string,
  activeBorder: string,
  activeBg: string,
  activeColor: string,
  size: number,
  bgEmpty: string,
  gap: number,
  fontSize: number,
  fontSizeDays: number,
  fontSizeYM: number,
}

type CalendarLegend = {
  show: boolean
}

type CalendarGeneralStyle = {
  cells: CalendarGeneralStyleCells,
  font: string
}

type CalendarDataStatus = {
  legend: string,
  bg: string,
  color: string,
  border: string
}

type CalendarData = {
  date: Date,
  status: number,
}

type Data = {
  calendar: Array<CalendarData>;
  status: Array<CalendarDataStatus>;
  style: CalendarGeneralStyle;
  lang: AvailableLang;
  current_date: Date;
  display_date: Date;
}

type AvailableLang = "FR" | "EN" | "ES" | "DE";

type Translation = {
  month: Array<string>;
  weekday: Array<string>;
}

// Constants

/**
 * Add translations for month here
 * Don't forget to add the prefix lang in type AvailableLang + WEEKDAY + TRANSLATION
 */
const FR_MONTH        = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "décembre"];
const EN_MONTH        = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const ES_MONTH        = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DE_MONTH        = ["januar", "februar", "märz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"];

/**
 * Add translations for days here
 * Don't forget to add the prefix lang in type AvailableLang + MONTH + TRANSLATION
 */
const FR_WEEKDAY      = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const EN_WEEKDAY      = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const ES_WEEKDAY      = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const DE_WEEKDAY      = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sonntag"];

/**
 * Add translations tables here
 * Don't forget to add the prefix lang in type AvailableLang + MONTH + WEEKDAY
 */
const FR_TRANSLATION: Translation    = {month: FR_MONTH, weekday: FR_WEEKDAY};
const EN_TRANSLATION: Translation    = {month: EN_MONTH, weekday: EN_WEEKDAY};
const ES_TRANSLATION: Translation    = {month: ES_MONTH, weekday: ES_WEEKDAY};
const DE_TRANSLATION: Translation    = {month: DE_MONTH, weekday: DE_WEEKDAY};

/**
 * CONSTANTS
 * Add Constants here if needed
 */
const MAX_DAYS_IN_WEEK          = 7;
const MAX_MONTH_IN_YEAR         = 12;
const MAX_WEEKS_IN_MONTH        = 6;

/**
 * Possible Actions Event on the component.
 */
const Actions = {
  UP: "calendar_reducer_up",
  DOWN: "calendar_reducer_down",
}

// Utilities
/**
 * Return an object containing two array
 * month and weekday 
 * translated in the available lang provided in param
 * 
 * @param lang as AvailableLang
 * @returns Translation 
 */
function getTranslation(lang: AvailableLang): Translation {
  return typeof eval(lang+"_TRANSLATION") !== undefined ? eval(lang+"_TRANSLATION") as Translation : EN_TRANSLATION;
}

/**
 * Return an array with all days of the month with each
 * index corresponding to a cells on the visuals 
 * 0 indicate no content
 * 
 * @param month as number
 * @param year as number
 * @returns Array of Date or number
 */
function getAllDaysInMonth(month:number, year:number): Array<Date | number> {
  let date = new Date(year, month, 1);
  let arrayOfAllDays: Array<Date> = [];

  while(date.getMonth() === month) {
    arrayOfAllDays.push(new Date(date.getTime()));
    date.setDate(date.getDate() + 1);
  }

  return padDateOnMonthArray(arrayOfAllDays);
}

/**
 * move the starting date content to the correct index
 * corresponding to the correct day 
 * 
 * @param dates as Date
 * @returns Array of Date of number
 */
function padDateOnMonthArray(dates: Array<Date>): Array<Date | number> {
  let firstDayOfTheMonth: Date = dates[0];
  let newArrayOfDates: Array<Date | number> = [...dates];
  for(let missing_days = 1 ; missing_days < firstDayOfTheMonth.getDay() ; missing_days++) {
    newArrayOfDates.unshift(0);
  }
  return newArrayOfDates;
}

/**
 * Return the index of the date according to the table of Dates
 * 
 * @param row as number
 * @param col as number
 * @returns number
 */
function getDateIndexInCalendar(row: number, col: number): number {
  return row*7+col;
}

/**
 * Compare 2 Dates on their Year, Month and Date only
 * 
 * @param reference as Date
 * @param to_compare as Date
 * @returns boolean
 */
function isSameDate(reference: Date, to_compare: Date): boolean {
  if(
    reference.getFullYear() === to_compare.getFullYear() &&
    reference.getMonth() === to_compare.getMonth() &&
    reference.getDate() === to_compare.getDate()
  ) {
    return true;
  }
  return false;
}

function applyStyle(style: CalendarGeneralStyle) {
  let root = document.querySelector(':root');
  if(!!root && root instanceof HTMLElement) {
    !!style.cells.size && root.style.setProperty('--day-width', `${style.cells.size}px`);
    !!style.cells.activeBorder && root.style.setProperty('--active-border', style.cells.activeBorder);
    !!style.cells.bg && root.style.setProperty('--background', style.cells.bg);
    !!style.cells.border && root.style.setProperty('--border', style.cells.border);
    !!style.cells.borderRadius && root.style.setProperty('--border-radius', `${style.cells.borderRadius}px`);
    !!style.cells.color && root.style.setProperty('--color', style.cells.color);
    !!style.cells.bgEmpty && root.style.setProperty('--empty', style.cells.bgEmpty);
    !!style.cells.gap && root.style.setProperty('--gap', `${style.cells.gap}px`);
    !!style.cells.fontSize && root.style.setProperty('--font-size', `${style.cells.fontSize}px`);
    !!style.cells.fontSizeDays && root.style.setProperty('--font-size-days', `${style.cells.fontSizeDays}px`);
    !!style.cells.fontSizeYM && root.style.setProperty('--font-size-ym', `${style.cells.fontSizeYM}px`);
  }
}

//Class Calendar

class Calendar {
  private ctx?: HTMLElement | null;
  private isCtxDefined: boolean;

  private current_date: Date;
  private current_year: number;
  private current_month: number;
  private current_day: number;

  private display_year: number;
  private display_month: number;

  private lang: Translation;

  private calendar: Array<CalendarData>;
  private status: Array<CalendarDataStatus>;
  private style: CalendarGeneralStyle;

  constructor(
    id: string, 
    data: Data
  ) {

    this.ctx            = document.querySelector(id);
    this.isCtxDefined   = !!this.ctx ? true : false;

    this.current_date   = !!data.current_date ? data.current_date : new Date();
    this.current_year   = this.current_date.getFullYear();
    this.current_month  = this.current_date.getMonth();
    this.current_day    = this.current_date.getDate();

    this.display_year   = !!data.display_date ? data.display_date.getFullYear(): this.current_date.getFullYear();
    this.display_month  = !!data.display_date ? data.display_date.getMonth() : this.current_date.getMonth();

    this.lang           = getTranslation(data.lang);

    this.calendar       = data.calendar;
    this.status         = data.status;
    this.style          = data.style;

    applyStyle(this.style);
    this.create();
  }

  public ctxIsDefined(): boolean {
    return this.isCtxDefined;
  }

  private reducer(action:string) {
    switch(action) {
      case Actions.UP:
        if(this.display_month < 11){ this.display_month++ }else{ this.display_year++; this.display_month = 0; }
        this.update()
        break;
      case Actions.DOWN:
        if(this.display_month > 0){ this.display_month-- }else{ this.display_year--; this.display_month = 11; }
        this.update()
        break;
      default:
        break;
    }
  }

  private create(): boolean {
    if(null === this.ctx || undefined === this.ctx) {
      console.error('The Context was not found. Verify the Context Id or add defer attribute on your script tag');
      return false;
    }

    this.ctx.classList.add('calendar-js')

    this.ctx.appendChild(this.create_header(this.ctx));
    this.ctx.appendChild(this.create_days_column(this.ctx));
    this.ctx.appendChild(this.create_weeks(this.ctx));
    this.ctx.appendChild(this.create_legends(this.ctx));
    return true;
  }

  private update() {
    if(null === this.ctx || undefined === this.ctx) {
      console.error('The Context was not found. Verify the Context Id or add defer attribute on your script tag');
      return false;
    }
    let monthElement = document.getElementById(this.ctx.id+"-month");

    if(null === monthElement || undefined === monthElement) {
      console.error('The Title was not found');
      return false;
    }

    monthElement.innerText = `${this.lang.month[this.display_month]} ${this.display_year}`;

    let display_all_days = getAllDaysInMonth(this.display_month, this.display_year);
    for (let week = 0; week < MAX_WEEKS_IN_MONTH; week++) {
      for (let week_day = 0; week_day < MAX_DAYS_IN_WEEK; week_day++) {
        let index = week*7+week_day;
        let to_update_week_day = document.querySelector("#"+this.ctx.id+" [data-day='"+index+"']");

        if(to_update_week_day instanceof HTMLElement) {
          to_update_week_day.classList.remove('calendar-js-no-day');

          to_update_week_day.style.background = '';
          to_update_week_day.style.color = '';
          to_update_week_day.style.border = '';

          let dateNumber = display_all_days[getDateIndexInCalendar(week, week_day)];
          if (dateNumber instanceof Date ) { 
            to_update_week_day.innerText = (dateNumber.getDate()).toString() 
            this.apply_data(to_update_week_day, dateNumber);
            this.highlight_today(to_update_week_day, dateNumber);
          } else {
            to_update_week_day.innerText = "" ;
            to_update_week_day.classList.add('calendar-js-no-day');
          }
        }
      }
    }
  }

  private create_header(context: HTMLElement): HTMLElement {
    let header = document.createElement('div');
    header.classList.add('calendar-js-header');

    let buttonDown = document.createElement('button');
    buttonDown.classList.add('calendar-js-down');
    buttonDown.innerText = "<";
    buttonDown.addEventListener('pointerdown', () => {
      this.reducer(Actions.DOWN);
    })

    let buttonUp = document.createElement('button');
    buttonUp.classList.add('calendar-js-down');
    buttonUp.innerText = ">";
    buttonUp.addEventListener('pointerdown', () => {
      this.reducer(Actions.UP);
    })

    let month = document.createElement('p'); 
    month.classList.add('calendar-js-month'); 
    month.innerText = `${this.lang.month[this.display_month]} ${this.display_year}`; 
    month.id = context.id+"-month";

    header.appendChild(buttonDown);
    header.appendChild(month);
    header.appendChild(buttonUp);

    return header;
  }

  private create_days_column(context: HTMLElement): HTMLElement {
    let days = document.createElement('div'); 
    days.classList.add('calendar-js-days');

    for (let day = 0; day < MAX_DAYS_IN_WEEK; day++) {
      let display_day = document.createElement('div'); 
      display_day.classList.add('calendar-js-day'); 
      display_day.innerText = `${this.lang.weekday[day].substring(0,3)}`;
      days.appendChild(display_day);
    }

    return days;
  }

  private create_weeks(context: HTMLElement): HTMLElement {
    let calendar_body = document.createElement('div'); 
    calendar_body.classList.add('calendar-js-body');

    let display_all_days = getAllDaysInMonth(this.display_month, this.display_year);

    for (let week = 0; week < MAX_WEEKS_IN_MONTH; week++) {
      let display_week = document.createElement('div'); 
      display_week.classList.add('calendar-js-week'); 

      for (let week_day = 0; week_day < MAX_DAYS_IN_WEEK; week_day++) {
        let display_week_day = document.createElement('div');
        display_week_day.classList.add('calendar-js-week-day'); 
        display_week_day.dataset.day = (week*7+week_day).toString();

        let dateNumber = display_all_days[getDateIndexInCalendar(week, week_day)];
        if (dateNumber instanceof Date) { 
          display_week_day.innerText = (dateNumber.getDate()).toString() 
          this.apply_data(display_week_day, dateNumber);
          this.highlight_today(display_week_day, dateNumber);
        } else {
          display_week_day.innerText = "" ;
          display_week_day.classList.add('calendar-js-no-day');
        }

        display_week.appendChild(display_week_day);
      }
      calendar_body.appendChild(display_week);
    }

    return calendar_body;
  }

  private create_legends(context: HTMLElement): HTMLElement {
    let calendar_legends = document.createElement('div');
    calendar_legends.classList.add('calendar-js-legends');
    for(let index = 0; index < this.status.length; index++) {
      let legend = document.createElement('div');
      legend.classList.add('calendar-js-legend');

      let sample = document.createElement('div');
      sample.classList.add('calendar-js-legend-sample');
      sample.style.background = !!this.status[index].bg ? this.status[index].bg : "white";

      let description = document.createElement('p');
      description.classList.add('calendar-js-legend-description');
      description.innerText = !!this.status[index].legend ? this.status[index].legend : "undefined";

      legend.appendChild(sample);
      legend.appendChild(description);

      calendar_legends.appendChild(legend);
    }

    return calendar_legends;
  }

  private apply_data(element: HTMLElement, day: Date) {
      this.calendar.forEach((data) => {
        if(data.date !== undefined && day.valueOf() === data.date.valueOf()){
          element.style.background = !!this.status[data.status].bg ? 
            this.status[data.status].bg : 
            !!this.style.cells.bg ? this.style.cells.bg : "#F1F1F1" ;
          element.style.color = !!this.status[data.status].color ? 
            this.status[data.status].color : 
            "none";
          element.style.border = !!this.status[data.status].border ? 
            this.status[data.status].border : 
            "none";
        }
      })
  }

  private highlight_today(element: HTMLElement, day: Date) {
    if(isSameDate(this.current_date, day)) {
      element.style.border = ''
      element.classList.add('calendar-js-current-day');
    } else {
      element.classList.remove('calendar-js-current-day');
    }
  }
}

window.addEventListener('load', () => {
  var CalendarJS=function(
    id: string, 
    data: Data
  ){
  
    return new Calendar(
      id, 
      data
    );
  }   
})

