import React, {useState} from "react";
import Timeline, {TimelineGroupBase, TimelineItemBase} from "react-calendar-timeline";
import moment from "moment";
import {DrupalUser, EventLocation, Rule, ScheduleEvent} from "./resource/Types";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

const parser = require('cron-parser');

enum DisplayMode {
    LocationBased,
    UserBased,
}

function isTouchDevice(): boolean {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

const timeRange = isTouchDevice() ? 1 : 6;

const renderLocationBased = (locations: EventLocation[], events: ScheduleEvent[], users: DrupalUser[], rules: Rule[])
    : [TimelineGroupBase[], TimelineItemBase<moment.Moment>[]] => {
    const transformedLocations: TimelineGroupBase[] = locations.map((location, index) => {
        return {
            id: location.id,
            title: location.name
        }
    });
    const transformedEvents: TimelineItemBase<moment.Moment>[] = events.flatMap((event, index) => {
        const title = event.users
            .map(userId => users.find(user => user.id === userId))
            .map(user => user?.username ?? "-")
            .join(", ");

        if (event.repeatRule !== undefined && event.repeatRule.length !== 0 && event.repeatRule !== "0") {
            const cronEvents: TimelineItemBase<moment.Moment>[] = [];
            const forwardInterval = parser.parseExpression(event.repeatRule);
            const backwardsInterval = parser.parseExpression(event.repeatRule);
            for (let i = 0; i < 7; i++) {
                const date = forwardInterval.next().toDate();
                cronEvents.push({
                    id: event.id + "::elore::" + i,
                    group: event.location,
                    start_time: moment(date),
                    end_time: moment(date)
                        .add(event.length.hour(), 'hours')
                        .add(event.length.minute(), 'minutes'),
                    title: title,
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            }
            for (let i = 0; i < 3; i++) {
                const date = backwardsInterval.prev().toDate();
                cronEvents.push({
                    id: event.id + "::hatra::" + i,
                    group: event.location,
                    start_time: moment(date),
                    end_time: moment(date)
                        .add(event.length.hour(), 'hours')
                        .add(event.length.minute(), 'minutes'),
                    title: title,
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            }
            return cronEvents;
        } else {
            return [{
                id: event.id,
                group: event.location,
                start_time: event.startTimeDate,
                end_time: event.startTimeDate
                    .clone()
                    .add(event.length.hour(), 'hours')
                    .add(event.length.minute(), 'minutes'),
                title: title,
                canMove: false,
                canResize: false,
                canChangeGroup: false,
            }];
        }
    });
    rules.flatMap(rule => {
        const cronEvents: TimelineItemBase<moment.Moment>[] = [];
        const forwardInterval = parser.parseExpression(rule.repeatRule);
        const backwardsInterval = parser.parseExpression(rule.repeatRule);
        for (let i = 0; i < 7; i++) {
            const date = forwardInterval.next().toDate();
            const start = moment(date);
            const end = moment(date)
                .add(rule.length.hour(), 'hours')
                .add(rule.length.minute(), 'minutes');

            transformedLocations.forEach(location => {
                cronEvents.push({
                    id: "rule::" + rule.id + "::elore::" + i + "::" + location.id,
                    group: location.id,
                    start_time: start,
                    end_time: end,
                    title: "TILTAS",
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            });

        }
        for (let i = 0; i < 3; i++) {
            const date = backwardsInterval.prev().toDate();
            const start = moment(date);
            const end = moment(date)
                .add(rule.length.hour(), 'hours')
                .add(rule.length.minute(), 'minutes');
            transformedLocations.forEach(location => {
                cronEvents.push({
                    id: "rule::" + rule.id + "::hatra::" + i + "::" + location.id,
                    group: location.id,
                    start_time: start,
                    end_time: end,
                    title: "TILTAS",
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            });
        }
        return cronEvents;
    }).forEach(item => {
        transformedEvents.push(item)
    });

    return [transformedLocations, transformedEvents];
};

const renderUserBased = (locations: EventLocation[], events: ScheduleEvent[], users: DrupalUser[], rules: Rule[])
    : [TimelineGroupBase[], TimelineItemBase<moment.Moment>[]] => {
    const transformedLocations: TimelineGroupBase[] = users.map((user, index) => {
        return {
            id: user.username,
            title: user.username
        }
    });

    const transformedEvents: TimelineItemBase<moment.Moment>[] = events.flatMap((event, index) => {
        const usernames = event.users
            .map(userId => users.find(user => user.id === userId))
            .map(user => user?.username ?? "-");
        const title = locations.find(location => location.id === event.location)?.name ?? "-";

        const items: TimelineItemBase<moment.Moment>[] = usernames.flatMap(username => {
            if (event.repeatRule !== undefined && event.repeatRule.length !== 0 && event.repeatRule !== "0") {
                const cronEvents: TimelineItemBase<moment.Moment>[] = [];
                const forwardInterval = parser.parseExpression(event.repeatRule);
                const backwardsInterval = parser.parseExpression(event.repeatRule);
                for (let i = 0; i < 7; i++) {
                    const date = forwardInterval.next().toDate();
                    cronEvents.push({
                        id: username + "::" + event.id + "::elore::" + i,
                        group: username,
                        start_time: moment(date),
                        end_time: moment(date)
                            .add(event.length.hour(), 'hours')
                            .add(event.length.minute(), 'minutes'),
                        title: title,
                        canMove: false,
                        canResize: false,
                        canChangeGroup: false,
                    });
                }
                for (let i = 0; i < 3; i++) {
                    const date = backwardsInterval.prev().toDate();
                    cronEvents.push({
                        id: username + "::" + event.id + "::hatra::" + i,
                        group: username,
                        start_time: moment(date),
                        end_time: moment(date)
                            .add(event.length.hour(), 'hours')
                            .add(event.length.minute(), 'minutes'),
                        title: title,
                        canMove: false,
                        canResize: false,
                        canChangeGroup: false,
                    });
                }
                return cronEvents;
            } else {
                return [{
                    id: username + "::" + event.id,
                    group: username,
                    start_time: event.startTimeDate,
                    end_time: event.startTimeDate
                        .clone()
                        .add(event.length.hour(), 'hours')
                        .add(event.length.minute(), 'minutes'),
                    title: title,
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                }];
            }
        });
        return items;
    });
    rules.flatMap(rule => {
        const cronEvents: TimelineItemBase<moment.Moment>[] = [];
        const forwardInterval = parser.parseExpression(rule.repeatRule);
        const backwardsInterval = parser.parseExpression(rule.repeatRule);
        for (let i = 0; i < 7; i++) {
            const date = forwardInterval.next().toDate();
            const start = moment(date);
            const end = moment(date)
                .add(rule.length.hour(), 'hours')
                .add(rule.length.minute(), 'minutes');

            transformedLocations.forEach(location => {
                cronEvents.push({
                    id: "rule::" + rule.id + "::elore::" + i + "::" + location.id,
                    group: location.id,
                    start_time: start,
                    end_time: end,
                    title: "TILTAS",
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            });

        }
        for (let i = 0; i < 3; i++) {
            const date = backwardsInterval.prev().toDate();
            const start = moment(date);
            const end = moment(date)
                .add(rule.length.hour(), 'hours')
                .add(rule.length.minute(), 'minutes');
            transformedLocations.forEach(location => {
                cronEvents.push({
                    id: "rule::" + rule.id + "::hatra::" + i + "::" + location.id,
                    group: location.id,
                    start_time: start,
                    end_time: end,
                    title: "TILTAS",
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            });
        }
        return cronEvents;
    }).forEach(item => {
        transformedEvents.push(item)
    });

    return [transformedLocations, transformedEvents];
};

const DailyTimeline: React.FunctionComponent<{
    locations: EventLocation[],
    events: ScheduleEvent[],
    users: DrupalUser[],
    rules: Rule[],
}> = props => {
    const [filter, setFilter] = useState<DisplayMode>(DisplayMode.LocationBased);

    let chosen = "";
    let renderedTimeline = (<></>);

    switch (filter) {
        case DisplayMode.LocationBased:
            chosen = "Eszköz alapú";
            const [lLocations, lEvents] = renderLocationBased(props.locations, props.events, props.users, props.rules);
            renderedTimeline = (
                <Timeline
                    groups={lLocations}
                    items={lEvents}
                    defaultTimeStart={moment().add(0 - timeRange, 'hour')}
                    defaultTimeEnd={moment().add(timeRange, 'hour')}
                />
            );
            break;
        case DisplayMode.UserBased:
            chosen = "Személy alapú";

            const [uLocations, uEvents] = renderUserBased(props.locations, props.events, props.users, props.rules);
            renderedTimeline = (
                <Timeline
                    groups={uLocations}
                    items={uEvents}
                    defaultTimeStart={moment().add(0 - timeRange, 'hour')}
                    defaultTimeEnd={moment().add(timeRange, 'hour')}
                />
            );
            break;
    }

    const dueTimers: ScheduleEvent[] = props.events.filter(event => {
        return event.dueTime.isValid();
    });

    return (
        <>
            <FormControl style={{width: "100%", display: "flex", justifyContent: "center", justifyItems: "center"}}>
                <div style={{width: "100px"}}>
                    <InputLabel id="label">Felbontás</InputLabel>
                    <Select labelId="label" id="select"
                            value={filter === DisplayMode.LocationBased ? "location" : "user"}
                            onChange={e => {
                                if (typeof e.target.value === "string") {
                                    const menu: string = e.target.value;
                                    switch (menu) {
                                        case "location":
                                            setFilter(DisplayMode.LocationBased);
                                            break;
                                        case "user":
                                            setFilter(DisplayMode.UserBased);
                                            break;
                                    }
                                }
                            }}>
                        <MenuItem value="location" key="location">Hely alapú</MenuItem>
                        <MenuItem value="user" key="user">Felhasználó alapú</MenuItem>
                    </Select>
                </div>
            </FormControl>
            {renderedTimeline}
            <div hidden={dueTimers.length === 0}>
                <h1>
                    Határidős feladatok:
                </h1>
                {dueTimers.map(event => {
                    return (
                        <div>
                            {event.type} <small>{event.comment}</small> - {event.dueTime.format('YYYY-MM-DD')}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default DailyTimeline;