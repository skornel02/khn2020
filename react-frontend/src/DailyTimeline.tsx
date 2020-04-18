import React from "react";
import Timeline, {TimelineGroupBase, TimelineItemBase} from "react-calendar-timeline";
import moment from "moment";
import {EventLocation, ScheduleEvent} from "./resource/Types";

function isTouchDevice(): boolean {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

const DailyTimeline: React.FunctionComponent<{
    locations: EventLocation[],
    events: ScheduleEvent[],
}> = props => {
    const locations: TimelineGroupBase[] = props.locations.map((location, index) => {
        return {
            id: index + 1,
            title: location.name
        }
    });
    const events: TimelineItemBase<moment.Moment>[] = props.events.map((event, index) => {
        if (event.startDate === ""){
            event.startDate = moment().format("YYYY-MM-DD")
        }

        console.log(event);
        if (event.repeatRule !== undefined && event.repeatRule.length !== 0 && event.repeatRule !== "0") {
            console.log(event.repeatRule);
        }

        return {
            id: event.id,
            group: event.location,
            start_time: moment(event.startDate + " " + event.startTime),
            end_time: moment(event.startDate + " " + event.startTime).add(event.length, "hour"),
            title: event.type,
            canMove: false,
            canResize: false,
            canChangeGroup: false,
        }
    });

    const timeRange = isTouchDevice() ? 1 : 12;

    return (
        <div>
            <Timeline
                groups={locations}
                items={events}
                defaultTimeStart={moment().add(0 - timeRange, 'hour')}
                defaultTimeEnd={moment().add(timeRange, 'hour')}
            />
        </div>
    );
};

export default DailyTimeline;