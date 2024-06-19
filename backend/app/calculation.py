from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


def calculate_difference(start_date: str, end_date: str) -> dict:
    # datetime object preparation
    start = datetime.strptime(start_date, "%Y-%m-%d")
    if end_date:
        end = datetime.strptime(end_date, "%Y-%m-%d")
    else:
        end = datetime.today()
    days_delta = end - start

    # get the calculations
    date_diff = relativedelta(end, start)
    dwmy_years = date_diff.years
    dwmy_months = date_diff.months
    dwmy_weeks = date_diff.days // 7
    dwmy_days = date_diff.days % 7

    def add_label(value, singular, plural):
        return f"{value} {plural if value > 1 else singular}"

    # arrangements: [ dwmy, dwm, dw, d ]
    data_without_label = [
        [
            dwmy_days,
            dwmy_weeks,
            dwmy_months,
            dwmy_years,
        ],
        [
            dwmy_days,
            dwmy_weeks,
            dwmy_months + dwmy_years * 12,
        ],
        [
            dwmy_days,
            dwmy_weeks + (dwmy_years * 12 + dwmy_months) * 4,
        ],
        [days_delta.days],
    ]

    CONSTANTS = [
        ("day", "days"),
        ("week", "weeks"),
        ("month", "months"),
        ("year", "years"),
    ]

    days_formatting = []

    # add labels to values and join them in a string
    for data in data_without_label:
        mod_value = []
        for value, labels in zip(data, CONSTANTS):
            if value:
                mod_value.append(add_label(value, labels[0], labels[1]))
        done_value = ", ".join(reversed(mod_value))
        if done_value not in days_formatting:
            days_formatting.append(done_value)

    return list(reversed(days_formatting))
