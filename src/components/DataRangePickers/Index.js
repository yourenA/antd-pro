import React, { Component } from 'react';
import { DatePicker } from 'antd';

class DateRange extends Component {
  state = {
    startValue: null,
    endValue: null,
  };

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div>
        <DatePicker
          format="YYYY-MM-DD"
          value={startValue}
          onChange={this.onStartChange}
        />
        <DatePicker
          format="YYYY-MM-DD"
          value={endValue}
          onChange={this.onEndChange}
        />
      </div>
    );
  }
}

export default DateRange
