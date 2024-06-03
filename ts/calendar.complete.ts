
// Types

type CalendarGeneralStyleDefaultPadding = number;
type CalendarGeneralStyleHVPadding = {
  horizontal: number;
  vertical: number;
};
type CalendarGeneralStyleFullPadding = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

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
}

type CalendarGeneralStyleCalendar = {
  border: string;
  borderRadius: string;
  bg: string;
  color: string;
  fontSizeDays: number;
  fontSizeYM: number;
  padding: CalendarGeneralStyleDefaultPadding | CalendarGeneralStyleHVPadding | CalendarGeneralStyleFullPadding;
}

type CalendarLegend = {
  visibility: 'show' | 'hide';
  position: 'left' | 'right' | 'bottom' | 'top';
};


type CalendarGeneralStyle = {
  calendar: CalendarGeneralStyleCalendar,
  cells: CalendarGeneralStyleCells,
  font: string;
  legend: CalendarLegend;
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

type DataEditor = {
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
  APPLY: "calendar_reducer_apply",
  PICK: "calendar_reducer_pick",
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
    //Cells
    if(!!style.cells) {
      !!style.cells.size && root.style.setProperty('--day-width', `${style.cells.size}px`);
      !!style.cells.activeBorder && root.style.setProperty('--active-border', style.cells.activeBorder);
      !!style.cells.bg && root.style.setProperty('--background-cells', style.cells.bg);
      !!style.cells.border && root.style.setProperty('--border-cells', style.cells.border);
      !!style.cells.borderRadius && root.style.setProperty('--border-radius-cells', `${style.cells.borderRadius}px`);
      !!style.cells.color && root.style.setProperty('--color-cells', style.cells.color);
      !!style.cells.bgEmpty && root.style.setProperty('--empty', style.cells.bgEmpty);
      !!style.cells.gap && root.style.setProperty('--gap', `${style.cells.gap}px`);
      !!style.cells.fontSize && root.style.setProperty('--font-size-cells', `${style.cells.fontSize}px`);
    }


    //Calendar
    if(!!style.calendar) {
      !!style.calendar.fontSizeDays && root.style.setProperty('--font-size-days', `${style.calendar.fontSizeDays}px`);
      !!style.calendar.fontSizeYM && root.style.setProperty('--font-size-ym', `${style.calendar.fontSizeYM}px`);
      !!style.calendar.bg && root.style.setProperty('--background-cal', style.calendar.bg);
      !!style.calendar.border && root.style.setProperty('--border-cal', style.calendar.border);
      !!style.calendar.borderRadius && root.style.setProperty('--border-radius-cal', `${style.calendar.borderRadius}px`);
      !!style.calendar.color && root.style.setProperty('--color-cal', style.calendar.color);
      if(!!style.calendar.padding) {
        if(typeof style.calendar.padding === 'number') {
          let padding = style.calendar.padding as CalendarGeneralStyleDefaultPadding;
          !!padding && root.style.setProperty('--padding-top-cal', `${padding}px`);
          !!padding && root.style.setProperty('--padding-bottom-cal', `${padding}px`);
          !!padding && root.style.setProperty('--padding-right-cal', `${padding}px`);
          !!padding && root.style.setProperty('--padding-left-cal', `${padding}px`);
        }
        else if(
          'top' in style.calendar.padding || 
          'bottom' in style.calendar.padding || 
          'left' in style.calendar.padding ||
          'right' in style.calendar.padding) {
            let padding = style.calendar.padding as CalendarGeneralStyleFullPadding;
            !!padding.top && root.style.setProperty('--padding-top-cal', `${padding.top}px`);
            !!padding.bottom && root.style.setProperty('--padding-bottom-cal', `${padding.bottom}px`);
            !!padding.right && root.style.setProperty('--padding-right-cal', `${padding.right}px`);
            !!padding.left && root.style.setProperty('--padding-left-cal', `${padding.left}px`);
        } else if(
          'horizontal' in style.calendar.padding || 
          'vertical' in style.calendar.padding ) {
            let padding = style.calendar.padding as CalendarGeneralStyleHVPadding;
            !!padding.vertical && root.style.setProperty('--padding-top-cal', `${padding.vertical}px`);
            !!padding.vertical && root.style.setProperty('--padding-bottom-cal', `${padding.vertical}px`);
            !!padding.horizontal && root.style.setProperty('--padding-right-cal', `${padding.horizontal}px`);
            !!padding.horizontal && root.style.setProperty('--padding-left-cal', `${padding.horizontal}px`);
        }
      }
      if(!!style.legend.position) {
        switch(style.legend.position) {
          case 'bottom':
            root.style.setProperty('--legend-position', 'column')
            break;
          case 'top':
            root.style.setProperty('--legend-position', 'column-reverse')
            break;
          case 'left':
            root.style.setProperty('--legend-position', 'row-reverse')
            break;
          case 'right':
            root.style.setProperty('--legend-position', 'row')
            break;
          default:
            root.style.setProperty('--legend-position', 'column')
            break;
        }
      }
      if(!!style.legend.visibility) {
        switch(style.legend.visibility) {
          case 'hide':
            root.style.setProperty('--legend-visibility', 'none')
            break;
          case 'show':
            root.style.setProperty('--legend-visibility', 'flex')
            break;
          default:
            root.style.setProperty('--legend-visibility', 'none')
            break;
        }
      }
    }
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

  private legend: CalendarLegend;

  constructor(
    id: string, 
    data: Data
  ) {

    this.ctx            = document.querySelector(id);
    this.isCtxDefined   = !!this.ctx ? true : false;

    this.current_date   = !!data.current_date ? new Date(data.current_date) : new Date();
    this.current_year   = this.current_date.getFullYear();
    this.current_month  = this.current_date.getMonth();
    this.current_day    = this.current_date.getDate();

    this.display_year   = !!data.display_date ? new Date(data.display_date).getFullYear(): this.current_date.getFullYear();
    this.display_month  = !!data.display_date ? new Date(data.display_date).getMonth() : this.current_date.getMonth();

    this.lang           = getTranslation(data.lang);

    this.calendar       = data.calendar;
    this.status         = data.status;
    this.style          = data.style;

    this.legend         = !!data.style.legend ? data.style.legend : {} as CalendarLegend;

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
    this.ctx.innerHTML = "";

    this.ctx.classList.add('calendar-js')

    let cal = document.createElement('div');

    cal.appendChild(this.create_header(this.ctx));
    cal.appendChild(this.create_days_column(this.ctx));
    cal.appendChild(this.create_weeks(this.ctx));

    this.ctx.appendChild(cal);

    this.ctx.appendChild(this.create_legends(this.ctx));
    return true;
  }

  private update() {
    if(null === this.ctx || undefined === this.ctx) {
      console.error('The Context was not found. Verify the Context Id or add defer attribute on your script tag');
      return false;
    }
    let monthElement = document.getElementById(this.ctx.id+"-month");
    let daysElement = document.querySelectorAll(".calendar-js-day");

    if(null === monthElement || undefined === monthElement) {
      console.error('The Title was not found');
      return false;
    }

    monthElement.innerText = `${this.lang.month[this.display_month]} ${this.display_year}`;

    for (let day = 0; day < MAX_DAYS_IN_WEEK; day++) {
      daysElement[day].innerHTML = `${this.lang.weekday[day].substring(0,3)}`;
    }

    this.create_legends(this.ctx);

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
    if(!!this.legend.visibility && this.legend.visibility === 'show') {
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
    } else {
      calendar_legends.style.display = 'none';
    }

    return calendar_legends;
  }

  private apply_data(element: HTMLElement, day: Date) {
      this.calendar.forEach((data) => {
        if(data.date !== undefined && day.valueOf() === data.date.valueOf()){
          let status = !!data.status ? data.status : 0;
          if(data.status < this.status.length) {
            element.style.background = !!this.status[status].bg ? 
              this.status[status].bg : 
              !!this.style.cells.bg ? this.style.cells.bg : "#F1F1F1" ;
            element.style.color = !!this.status[status].color ? 
              this.status[status].color : 
              "none";
            element.style.border = !!this.status[status].border ? 
              this.status[status].border : 
              "none";
          }
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

  public save() {
    return this.calendar;
  }

  public stylize(style: CalendarGeneralStyle) {
    applyStyle(style);
  }

  public useData(data: Data) {
    this.calendar = data.calendar;
    this.status = data.status;
    this.stylize(data.style);
    this.changeLang(data.lang)
    this.create();
  }

  public changeEntries(calendar: Array<CalendarData>) {
    this.calendar = calendar;
    this.update();
  }

  public changeLang(lang: AvailableLang) {
    this.lang = getTranslation(lang);
  }
}

//Class Editor

class CalendarEditor {
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

  private legend: CalendarLegend;

  private picked_status: number | null;

  constructor(
    id: string, 
    data: DataEditor
  ) {

    this.ctx            = document.querySelector(id);
    this.isCtxDefined   = !!this.ctx ? true : false;

    this.current_date   = !!data.current_date ? new Date(data.current_date) : new Date();
    this.current_year   = this.current_date.getFullYear();
    this.current_month  = this.current_date.getMonth();
    this.current_day    = this.current_date.getDate();

    this.display_year   = !!data.display_date ? new Date(data.display_date).getFullYear(): this.current_date.getFullYear();
    this.display_month  = !!data.display_date ? new Date(data.display_date).getMonth() : this.current_date.getMonth();

    this.lang           = getTranslation(data.lang);

    this.calendar       = [];
    this.status         = data.status;
    this.style          = data.style;

    this.legend         = !!data.style.legend ? data.style.legend : {} as CalendarLegend;
    // this.legend.visibility = "show";

    this.picked_status  = null;

    applyStyle(this.style);
    this.create();
  }

  public ctxIsDefined(): boolean {
    return this.isCtxDefined;
  }

  private reducer(action:string, data: any = null) {
    switch(action) {
      case Actions.UP:
        if(this.display_month < 11){ this.display_month++ }else{ this.display_year++; this.display_month = 0; }
        this.update()
        break;
      case Actions.DOWN:
        if(this.display_month > 0){ this.display_month-- }else{ this.display_year--; this.display_month = 11; }
        this.update()
        break;
      case Actions.APPLY:
        let replace:boolean = false;

        if(null !== this.picked_status && data.element instanceof HTMLElement) {

          let days = getAllDaysInMonth(this.display_month, this.display_year);

          let index = 0;
          let date_to_compare: Date = new Date(days[data.element.dataset.day]);
          
          for(index = 0; index < this.calendar.length; index++){
            if(this.calendar[index].date.getTime() === date_to_compare.getTime()) {
              replace = true;
              break;
            }
          }
          if(!replace) {
            this.calendar.push({
              date: date_to_compare,
              status: this.picked_status
            });
          } else {
            if (this.calendar[index].status === this.picked_status) {
              this.calendar.splice(index, 1);
              data.element.style = "";
            } else {
              this.calendar[index].status = this.picked_status
            }
          }
          // this.apply_data(data.element, data.date);
          // this.highlight_today(data.element, data.date);
          this.update();
        }
        break;
      case Actions.PICK:
        if(typeof data.index === "number" && data.element instanceof HTMLElement && data.parent instanceof HTMLElement) {
          this.picked_status = data.index;
          for(let index = 0; index < data.parent.children.length; index++) {
            data.parent.children[index].querySelector('.calendar-js-legend-sample').classList.remove('calendar-js-legend-sample-selected')
          }
          data.element.classList.add('calendar-js-legend-sample-selected');
        }
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

    this.ctx.innerHTML = "";

    this.ctx.classList.add('calendar-js')

    let cal = document.createElement('div');

    cal.appendChild(this.create_header(this.ctx));
    cal.appendChild(this.create_days_column(this.ctx));
    cal.appendChild(this.create_weeks(this.ctx));

    this.ctx.appendChild(cal);

    this.ctx.appendChild(this.create_legends(this.ctx));
    return true;
  }

  private update() {
    if(null === this.ctx || undefined === this.ctx) {
      console.error('The Context was not found. Verify the Context Id or add defer attribute on your script tag');
      return false;
    }
    let monthElement = document.getElementById(this.ctx.id+"-month");
    let daysElement = document.querySelectorAll(".calendar-js-day");

    if(null === monthElement || undefined === monthElement) {
      console.error('The Title was not found');
      return false;
    }

    for (let day = 0; day < MAX_DAYS_IN_WEEK; day++) {
      daysElement[day].innerHTML = `${this.lang.weekday[day].substring(0,3)}`;
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

        display_week_day.addEventListener('pointerdown', () => {
          this.reducer(Actions.APPLY, {element: display_week_day});
        })

        display_week.appendChild(display_week_day);
      }
      calendar_body.appendChild(display_week);
    }

    return calendar_body;
  }

  private create_legends(context: HTMLElement): HTMLElement {
    let calendar_legends = document.createElement('div');
    if(!!this.legend.visibility && this.legend.visibility === 'show') {
      calendar_legends.classList.add('calendar-js-legends');
      for(let index = 0; index < this.status.length; index++) {
        let legend = document.createElement('div');
        legend.classList.add('calendar-js-legend');

        let sample = document.createElement('div');
        sample.style.background = !!this.status[index].bg ? this.status[index].bg : "white";
        sample.classList.add('calendar-js-legend-sample');
        sample.classList.add('calendar-js-legend-sample-isSelectable');
        sample.addEventListener('pointerdown', () => {
          this.reducer(Actions.PICK, {element: sample, parent: calendar_legends, index: index})
        });

        let description = document.createElement('p');
        description.classList.add('calendar-js-legend-description');
        description.innerText = !!this.status[index].legend ? this.status[index].legend : "undefined";

        legend.appendChild(sample);
        legend.appendChild(description);

        calendar_legends.appendChild(legend);
      }


    } else {
      calendar_legends.style.display = 'none';
    }

    return calendar_legends;
  }

  private apply_data(element: HTMLElement, day: Date) {
      this.calendar.forEach((data) => {
        if(data.date !== undefined && day.valueOf() === data.date.valueOf()){
          let status = !!data.status ? data.status : 0;
          if(data.status < this.status.length) {
            element.style.background = !!this.status[status].bg ? 
              this.status[status].bg : 
              !!this.style.cells.bg ? this.style.cells.bg : "#F1F1F1" ;
            element.style.color = !!this.status[status].color ? 
              this.status[status].color : 
              "none";
            element.style.border = !!this.status[status].border ? 
              this.status[status].border : 
              "none";
          }
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

  public save() {
    return this.calendar;
  }

  public stylize(style: CalendarGeneralStyle) {
    applyStyle(style);
  }

  public useData(data: Data) {
    this.calendar = data.calendar;
    this.status = data.status;
    this.stylize(data.style);
    this.changeLang(data.lang)
    this.create();
  }

  public changeEntries(calendar: Array<CalendarData>) {
    this.calendar = calendar;
    this.update();
  }

  public changeLang(lang: AvailableLang) {
    this.lang = getTranslation(lang);
    this.update();
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

  var CalendarEditorJS=function(
    id: string, 
    data: DataEditor
  ){
    return new CalendarEditor(
      id, 
      data
    );
  }   
})

