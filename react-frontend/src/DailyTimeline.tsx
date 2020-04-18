import React, {useState} from "react";
import Timeline, {TimelineGroupBase, TimelineItemBase} from "react-calendar-timeline";
import moment from "moment";
import {EventLocation, ScheduleEvent} from "./resource/Types";

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

const timeRange = isTouchDevice() ? 1 : 12;

const renderLocationBased = (locations: EventLocation[], events: ScheduleEvent[]): [TimelineGroupBase[], TimelineItemBase<moment.Moment>[]] => {
    const transformedLocations: TimelineGroupBase[] = locations.map((location, index) => {
        return {
            id: index + 1,
            title: location.name
        }
    });
    const transformedEvents: TimelineItemBase<moment.Moment>[] = events.flatMap((event, index) => {
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
                    title: event.type,
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            }
            for (let i = 0; i < 3; i++) {
                const date = backwardsInterval.prev().toDate();
                cronEvents.push({
                    id: event.id + "::elore::" + i,
                    group: event.location,
                    start_time: moment(date),
                    end_time: moment(date)
                        .add(event.length.hour(), 'hours')
                        .add(event.length.minute(), 'minutes'),
                    title: event.type,
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
                title: event.type,
                canMove: false,
                canResize: false,
                canChangeGroup: false,
            }];
        }
    });
    return [transformedLocations, transformedEvents];
};

const renderUserBased = (locations: EventLocation[], events: ScheduleEvent[]): [TimelineGroupBase[], TimelineItemBase<moment.Moment>[]] => {
    const transformedLocations: TimelineGroupBase[] = locations.map((location, index) => {
        return {
            id: index + 1,
            title: location.name
        }
    });

    const transformedEvents: TimelineItemBase<moment.Moment>[] = events.flatMap((event, index) => {
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
                    title: event.type,
                    canMove: false,
                    canResize: false,
                    canChangeGroup: false,
                });
            }
            for (let i = 0; i < 3; i++) {
                const date = backwardsInterval.prev().toDate();
                cronEvents.push({
                    id: event.id + "::elore::" + i,
                    group: event.location,
                    start_time: moment(date),
                    end_time: moment(date)
                        .add(event.length.hour(), 'hours')
                        .add(event.length.minute(), 'minutes'),
                    title: event.type,
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
                title: event.type,
                canMove: false,
                canResize: false,
                canChangeGroup: false,
            }];
        }
    });
    return [transformedLocations, transformedEvents];
};

const DailyTimeline: React.FunctionComponent<{
    locations: EventLocation[],
    events: ScheduleEvent[],
}> = props => {
    const [filter, setFilter] = useState<DisplayMode>(DisplayMode.LocationBased);

    let chosen = "";
    let renderedTimeline = (<></>);

    switch (filter) {
        case DisplayMode.LocationBased:
            chosen = "Eszköz alapú";
            const [lLocations, lEvents] = renderLocationBased(props.locations, props.events);
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

            const [uLocations, uEvents] = renderUserBased(props.locations, props.events);
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

    return (
        <>
            <button onClick={() => {
                switch (filter) {
                    case DisplayMode.UserBased:
                        setFilter(DisplayMode.LocationBased); break;
                    case DisplayMode.LocationBased:
                        setFilter(DisplayMode.UserBased); break;
                }
            }}>
                {chosen}
            </button>
            {renderedTimeline}
        </>
    );
};

export default DailyTimeline;