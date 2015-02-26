var React = require('react');
var Classable = require('../mixins/classable');
var DateTime = require('../utils/date-time');
var DayButton = require('./day-button');

var CalendarMonth = React.createClass({displayName: "CalendarMonth",

  mixins: [Classable],

  propTypes: {
    displayDate: React.PropTypes.object.isRequired,
    onDayTouchTap: React.PropTypes.func,
    selectedDate: React.PropTypes.object.isRequired
  },

  render: function() {
    var classes = this.getClasses('mui-date-picker-calendar-month');

    return (
      React.createElement("div", {className: classes}, 
        this._getWeekElements()
      )
    );
  },

  _getWeekElements: function() {
    var weekArray = DateTime.getWeekArray(this.props.displayDate);

    return weekArray.map(function(week, i) {
      return (
        React.createElement("div", {
          key: i, 
          className: "mui-date-picker-calendar-month-week"}, 
          this._getDayElements(week)
        )
      );
    }, this);
  },

  _getDayElements: function(week) {
    return week.map(function(day, i) {
      var selected = DateTime.isEqualDate(this.props.selectedDate, day);
      return (
        React.createElement(DayButton, {
          key: i, 
          date: day, 
          onTouchTap: this._handleDayTouchTap, 
          selected: selected})
      );
    }, this);
  },

  _handleDayTouchTap: function(e, date) {
    if (this.props.onDayTouchTap) this.props.onDayTouchTap(e, date);
  }

});

module.exports = CalendarMonth;