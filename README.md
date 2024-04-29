<h1 algn="center">Calendar JS</h1>
Calendar JS is a lightweight, customable and easy to use tool used for displaying calendars with specific dates.

## Usage
```html
<script src="/js/calendar.complete.min.js"></script>
<link rel="stylesheet" href="/css/calendar.default.css">
<div id="calendar"></div>
<script>
  new Calendar("#calendar2", {});
</script> 
```

## Installation

You can clone or download the repo and build the source code with <code>npm run build</code>. You will get a javascript file in a build folder called calendar.complete.js, and a minified version called calendar.complete.min.js.

## Customization

The second parameter of the Calendar Class constructor is an array containing:
- **calendar** : list of all the dates that will have a specific status and informations.
- **status** : list of all the status that can be applied to dates.
- **style** : array of css rules for the customization.
- **lang** : language applied to the calendar.
- **display_date** : the date that will be use as the default month displayed on load.
- **current_date** : the date that will be highlight (by default today)

## Example
```javascript
new Calendar("#calendar", {
  calendar: [
    {
      date: new Date(2024, 3, 24),            
      status: 0                               // By default 0 if not set
    }
  ],
  status: [
    {                                         // Status style
      bg: "#0F1B38",
      color: "white",
      border: "2px solid #0F1B38",
      legend: "Full"                          // status label 
    }
  ],
  style: {
    calendar: {                               // Calendar General Style
      border: '1px solid #f1f1f1',
      borderRadius: 2,
      bg: 'white',
      color: 'black',
      fontSizeDays: 15,
      fontSizeYM: 20,
      padding: {
        top: 10,
        bottom: 20,
        right: 5,
        left: 5
      }
    }
    cells: {                                  // Default cells style
      border: "2px solid #f2f3f4",
      borderRadius: 3,
      bg: "#f8f9f9",
      activeBorder: "2px solid #A8ABE0",
      size: 40,
      bgEmpty: "transparent",
      color: "black",
      gap: 7,
      fontSize: 14,
    }
  },
  lang: "FR",                                 // Lang by default EN
  display_date: new Date(2024, 3),            // Month Display on load
  current_date: new Date(),                   // Date highlight
  legend: 'show'                              // Legend showed or hidden
})
```

## Releases

Here is the list of all releases with modifications. The last release correspond to the branch main in the repo.

### Release 1.0.0

First Release containing base customization