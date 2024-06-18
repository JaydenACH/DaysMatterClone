from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


def calculate_difference(start_date: str, end_date: str) -> dict:
    # date formatting preparation
    start = datetime.strptime(start_date, "%Y-%m-%d")
    if end_date:
        end = datetime.strptime(end_date, "%Y-%m-%d")
    else:
        end = datetime.today()
    days_delta = end - start

    # get the calculations
    date_diff = relativedelta(end, start)
    ymwd_years = date_diff.years
    ymwd_months = date_diff.months
    ymwd_weeks = date_diff.days // 7
    ymwd_days = date_diff.days % 7

    def add_label(value, singular, plural):
        return f"{value} {plural if value > 1 else singular}"

    raw_data = [
        [ymwd_years, ymwd_months, ymwd_weeks, ymwd_days],
        [ymwd_years * 12 + ymwd_months, ymwd_weeks, ymwd_days],
        [(ymwd_years * 12 + ymwd_months) * 4 + ymwd_weeks, ymwd_days],
        [days_delta.days],
    ]

    constants = [
        ("day", "days"),
        ("week", "weeks"),
        ("month", "months"),
        ("year", "years"),
    ]

    days_formatting = []

    for data in raw_data:
        mod_value = []
        for value, labels in zip(reversed(data), constants):
            if value:
                mod_value.append(add_label(value, labels[0], labels[1]))
        done_value = ", ".join(reversed(mod_value))
        if done_value not in days_formatting:
            days_formatting.append(done_value)
    return list(reversed(days_formatting))
